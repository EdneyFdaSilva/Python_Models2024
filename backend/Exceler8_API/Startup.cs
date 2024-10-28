using Exceler8_Domain.Repositories;
using Exceler8_Domain.Utils;
using Exceler8_API.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.Extensions.Logging;
using Exceler8_API.Handlers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using System;
using Microsoft.AspNetCore.Http;
using Exceler8_Domain.Infrastructure.IoC;
using Exceler8_Domain.Repositories.Config;
using Exceler8_Domain.Interfaces.Gss;
using Exceler8_Domain.Services;

namespace Exceler8_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            DomainInjection.Inject(ref services);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            var connection = new Connections();
            Configuration.GetSection("Connections").Bind(connection);
            services.AddSingleton(connection);

            var configs = new AppConfigs();
            Configuration.GetSection("AppConfigs").Bind(connection);
            services.AddSingleton(configs);

            ////---------
            //services.AddScoped<IGssService, GssService>();
            ////---------
            // Configurando a dependência para a classe de validação
            // de credenciais e geração de tokens
            services.AddScoped<AccessManager>();
            var signingConfigurations = new SigningConfigurations();
            services.AddSingleton(signingConfigurations);
            var tokenConfigurations = new TokenConfigurations();
            new ConfigureFromConfigurationOptions<TokenConfigurations>(
                Configuration.GetSection("TokenConfigurations"))
                    .Configure(tokenConfigurations);
            services.AddSingleton(tokenConfigurations);

            // Aciona a extensão que irá configurar o uso de
            // autenticação e autorização via tokens
            services.AddJwtSecurity(
                signingConfigurations, tokenConfigurations);

            services.AddDbContext<WaziContext>(options =>
                options.UseSqlServer(connection.SQLServer_Exceler8));

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
                    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Include;
                }
                );
            services.AddMemoryCache();
            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(r => r.FullName);
                c.SwaggerDoc("v1",
                        new Info
                        {
                            Title = "Exceler 8 API",
                            Version = "v1",
                            Description = "API para o App Exceler 8",
                            Contact = new Contact
                            {
                                Name = "FIT"
                            }
                        });
                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example - Authorization: Bearer {token}",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
            });

             IdentityModelEventSource.ShowPII = true;
        }

        private int UserStoreBase<T>()
        {
            throw new NotImplementedException();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            loggerFactory
                .AddFile("LOGS/E8_{Date}.txt");

            app.UseStaticFiles();

            app.UseCors(builder =>
            {
                builder.WithOrigins("*");
                builder.WithHeaders("*");
                builder.WithMethods("*");
            });

            // Ativando middlewares para uso do Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/backend/swagger/v1/swagger.json", "E8 API V1");
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "E8 API LOCAL");
            });

            app.UseMiddleware<ExceptionHandler>();
            app.UseMvc();
        }
    }
}