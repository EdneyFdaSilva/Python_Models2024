using Exceler8_API.Security;
using Exceler8_Domain.Entities;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Exceler8_API.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        UserService _userService;
        UserAccessService _userAccessService;
        public LoginController(UserService userService, UserAccessService userAccessService)
        {
            _userService = userService;
            _userAccessService = userAccessService;
        }

        [AllowAnonymous]
        [HttpPost]
        public object Post(
            [FromBody]AccessCredentials credenciais,
            [FromServices]AccessManager accessManager)
        {
            credenciais.UserName = accessManager.DecryptCredentials(credenciais.UserName);
            credenciais.Password = accessManager.DecryptCredentials(credenciais.Password);

            User userIdentity = _userService.GetUserFullByEmail(credenciais.UserName);
            if (accessManager.ValidateCredentials(credenciais, userIdentity))
            {
                try
                {
                    _userAccessService.Create(new UserAccess()
                    {
                        DateRegister = DateTime.Now,
                        Url = "/login",
                        UserId = userIdentity.Id
                    });
                }
                catch { }

                return accessManager.GenerateToken(credenciais, userIdentity);
            }
            else
            {
                return new
                {
                    Authenticated = false,
                    Message = "Falha ao autenticar"
                };
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ResetPassword")]
        public IActionResult ResetPassword([FromQuery]string email)
        {
            try
            {
                _userService.ResetPassword(email);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize("Bearer", Roles = "User")]
        [Route("ValidateToken")]
        public IActionResult ValidateToken()
        {
            return Ok(true);
        }
    }
}
