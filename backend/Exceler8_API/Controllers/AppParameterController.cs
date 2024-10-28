using Exceler8_Domain.DTOs;
using Exceler8_Domain.Models;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AppParameterController : ControllerBase
    {
        private readonly AppParameterService _service;
        public AppParameterController(AppParameterService service)
        {
            _service = service;
        }

        [HttpGet()]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());

        }

        [HttpGet("{id}")]
        public ActionResult<AppParameter> GetAppParameter(int id)
        {
            return Ok(_service.GetById(id));

        }

        [HttpPost]
        [Route("Save/")]
        public IActionResult Save(AppParameterDTO appParameterDTO)
        {
            AppParameter app = new AppParameter()
            {
                Id = appParameterDTO.Id,
                Name = appParameterDTO.Name,
                Description = appParameterDTO.Description,
                Value = appParameterDTO.Value

            };
             _service.Save(app);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _service.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}