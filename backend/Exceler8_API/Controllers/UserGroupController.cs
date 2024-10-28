using Exceler8_Domain.Repositories.Base;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserGroupController : ControllerBase
    {
        UserGroupService _service;
        UserGroupRepository _repository;

        public UserGroupController(UserGroupService service,
                                   UserGroupRepository repository)
        {
            _service = service;
            _repository = repository;
        }

        [HttpGet("{id}")]
        public IActionResult GetGroups(int id)
        {
            try
            {   
                return Ok(_repository.GetByUserId(id));                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
