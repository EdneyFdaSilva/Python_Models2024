using Exceler8_Domain.Models;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Dynamic;
using System.Net;
using System.Threading.Tasks;

namespace Exceler8_API.Handlers
{
    public class ExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly LogService _logservice;

        public ExceptionHandler(RequestDelegate next, LogService logservice)
        {
            _next = next;
            _logservice = logservice;
        }

        public async Task Invoke(HttpContext context)
       {
            DateTime dateInit = DateTime.Now;
            try
            {
                await _next.Invoke(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }

            try
            {
                var userId = context.User.FindFirst("Id")?.Value;
                _logservice.Save(new Log()
                {
                    DateTimeFinish = DateTime.Now,
                    DateTimeInit = dateInit,
                    Path = context.Request.Path,
                    Query = context.Request.QueryString.Value,
                    UserId = (string.IsNullOrEmpty(userId)) ? 0 : long.Parse(userId)
                });
            }
            catch { }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            var statusCode = (int)HttpStatusCode.InternalServerError;

            response.ContentType = "application/json";
            response.StatusCode = statusCode;

            dynamic responseObject =  new ExpandoObject();
            responseObject.Message = exception.Message;
            responseObject.Description = "Unexpected error";
            string responseJson =  JsonConvert.SerializeObject(responseObject);

            await response.WriteAsync(responseJson);
        }
    }
}