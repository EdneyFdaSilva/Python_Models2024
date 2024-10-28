using System;
using System.Collections.Generic;
using Exceler8_Domain.DTOs;
using Exceler8_Domain.Entities;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin,User")]
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly MenuService _service;
        private IHttpContextAccessor _httpContextAccessor;

        public MenuController(MenuService service, IHttpContextAccessor httpContextAccessor)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet()]
        [Route("TreeView")]
        public ActionResult<List<MenuTreeViewQuery>> GetTreeViewMenu()
        {
            try
            {
                return _service.GetMenuTreeViewQueries();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet()]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAllMenus());
        }

        [HttpGet("GetAllMenusWithSubmenusId/")]
        public IActionResult GetAllMenusWithSubmenusId()
        {
            var list = _service.GetAllMenusWithSubmenusId();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public ActionResult<Menu> GetMenu(int id)
        {
            return Ok(_service.GetMenuById(id));
        }

        [HttpPost]
        [Route("Save/")]
        public IActionResult Save(MenuDTO menuDTO)
        {
            Menu menu = new Menu()
            {
                Id = menuDTO.Id,
                Name = menuDTO.Name,
                IconClass = menuDTO.IconClass,
                Route = menuDTO.Route,
                MenuId = menuDTO.MenuId,
                Order = menuDTO.Order,
                Module = menuDTO.Module,
                PageName = menuDTO.PageName
            };
            _service.Save(menu);
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