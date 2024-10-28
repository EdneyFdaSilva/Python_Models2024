using System;
using Exceler8_Domain.Services;
using Exceler8_Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "User")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccessController : ControllerBase
    {
        
        UserAccessService _service;
        private IHttpContextAccessor _httpContextAccessor;

        public UserAccessController( UserAccessService service, IHttpContextAccessor httpContextAccessor)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;

        }


        [HttpPost]
        public IActionResult Create(string url)
        {
            var userId = _httpContextAccessor.HttpContext.User.FindFirst("Id").Value;
            UserAccess userEntity = new UserAccess
            {
                UserId = long.Parse(userId),
                Url = url,
                DateRegister = DateTime.Now       
                
            };

            _service.Create(userEntity);
            return Ok();
        }
    }
}
