using Exceler8_Domain.Services;
using Exceler8_Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Exceler8_Domain.DTOs;
using Exceler8_Domain.Repositories.SqlServer;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionGroupController: ControllerBase
    {
        PermissionGroupService _service;
        PermissionGroupRepository _repository;

        public PermissionGroupController(PermissionGroupService service,
                                         PermissionGroupRepository repository)
        {
            _service = service;
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
                return Ok(_service.GetAll().OrderBy(p => p.Name));
        }

        [HttpGet("{id}")]
        public ActionResult<PermissionGroup> GetById(int id)
        {
            return Ok(_service.GetById(id));
        }

        [HttpPost]
        public IActionResult Create(PermissionGroup permissionGroup)
        {
            _service.Create(permissionGroup);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, PermissionGroup permissionGroup)
        {
            _service.Update(id, permissionGroup);
            return Ok();
        }

        [HttpPost]
        [Route("Save")]
        public IActionResult Save(PermissionGroupMenuDTO permissionGroupMenuDTO)
        {
            _service.Save(permissionGroupMenuDTO);
            return Ok();
        }

        [HttpGet()]
        [Route("WithMenu/{id}")]
        public ActionResult<PermissionGroupMenuDTO> GetByIdWithMenu(int id)
        {
            return Ok(_repository.GetByIdWithMenu(id));
        }

        [HttpGet()]
        [Route("GetUsersRelated/{id}")]
        public ActionResult<PermissionGroupMenuDTO> GetUsersRelated(int id)
        {
            return Ok(_repository.GetUsersRelated(id));
        }
    }
}