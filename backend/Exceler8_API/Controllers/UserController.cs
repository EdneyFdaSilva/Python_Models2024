using System;
using Exceler8_Domain.Services;
using Exceler8_Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Exceler8_Domain.DTOs;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserService _service;
        UserGroupService _userGroupService;

        public UserController(UserService service,
                              UserGroupService userGroupService)
        {
            _service = service;
            _userGroupService = userGroupService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetById(int id)
        {
            return Ok(_service.GetById(id));
        }

        [HttpPost]
        [Route("Save/")]
        public IActionResult Save(UserGroupDTO userGroupDTO)
        {

            User user = new User()
            {
                Id = userGroupDTO.User.Id,
                Email = userGroupDTO.User.Email,
                Enabled = userGroupDTO.User.Enabled,
                Password = userGroupDTO.User.Password,
                UserRealName = userGroupDTO.User.UserRealName,
                Phone = userGroupDTO.User.Phone,
                Company = userGroupDTO.User.Company,
                Area = userGroupDTO.User.Area,
                Country = userGroupDTO.User.Country,
                Function = userGroupDTO.User.Function,
                ManagerName = userGroupDTO.User.ManagerName,
                ManagerEmail = userGroupDTO.User.ManagerEmail,
            };

            _userGroupService.Save(user, userGroupDTO.PermissionGroup);
            return Ok();
        }

        [HttpPost]
        public IActionResult Create(CreateUserDTO user)
        {
            User userEntity = new User
            {
                ManagerName = user.ManagerName,
                ManagerEmail = user.ManagerEmail,
                Password = user.Password,
                Phone = user.Phone,
                UserRealName = user.UserRealName,
                Username = user.Email,
                Company = user.Company,
                Area = user.Area,
                Country = user.Country,
                Email = user.Email,
                Enabled = user.Enabled,
                Function = user.Function
            };

            _service.Create(userEntity);
            return Ok();
        }

        [HttpPost]
        [Route("Delete/")]
        public IActionResult Delete([FromBody]int id)
        {
            try
            {
                _service.Delete(id);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, UserDTO user)
        {
            User userEntity = new User
            {
                Id = user.Id,
                ManagerName = user.ManagerName,
                ManagerEmail = user.ManagerEmail,
                Password = user.Password,
                Phone = user.Phone,
                UserRealName = user.UserRealName,
                Username = user.Email,
                Company = user.Company,
                Area = user.Area,
                Country = user.Country,
                Email = user.Email,
                Enabled = user.Enabled,
                Function = user.Function
            };

            _service.Update(id, userEntity);

            if (user.Id == 0)
            {
                return BadRequest();
            }
            else
            {
                return Ok();
            }
        }


    }
}