using Exceler8_Domain.DTOs;
using Exceler8_Domain.Entities;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class VersioningController : ControllerBase
    {
        private readonly VersioningService _service;
        public VersioningController(VersioningService service)
        {
            _service = service;
        }

        [HttpGet()]        
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());

        }

        [AllowAnonymous]
        [HttpGet()]
        [Route("LastVersion/")]
        public IActionResult GetLastVersion()
        {
            var ret = new Dictionary<string, string>();
            ret.Add("version", _service.GetLastVersion());

            return Ok(ret);
        }

        [HttpGet("{id}")]
        public ActionResult<Versioning> GetMenu(int id)
        {
            return Ok(_service.GetById(id));

        }

        [HttpPost]
        [Route("Save/")]
        public IActionResult Save(VersioningDTO versioningDTO)
        {
            Versioning versioning = new Versioning()
            {
                Id = versioningDTO.Id,
                Version = versioningDTO.Version,
                ReleaseDate = versioningDTO.ReleaseDate                    

            };
            _service.Save(versioning);
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