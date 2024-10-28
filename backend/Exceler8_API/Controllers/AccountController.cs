using System;
using Exceler8_Domain.Services;
using Exceler8_Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Exceler8_Domain.DTOs;
using Exceler8_Domain.Repositories.Base;
using System.Linq;
using System.Security.Claims;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin,User")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        UserService _service;
        MenuBaseRepository _menuRepository;

        private IHttpContextAccessor _httpContextAccessor;

        public AccountController(UserService service,
                                 MenuBaseRepository menuRepository,
                                 IHttpContextAccessor httpContextAccessor)
        {
            _service = service;
            _menuRepository = menuRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet()]
        public ActionResult<User> GetById(int id)
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst("Id").Value;
                var user = _service.GetById(int.Parse(userId));
                user.Roles = _httpContextAccessor.HttpContext.User.FindAll(ClaimTypes.Role).Select(x => x.Value).ToList();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost()]
        [Route("Save/")]
        public IActionResult UpdateMyInfo([FromBody]UserDTO user)
        {
            var userId = _httpContextAccessor.HttpContext.User.FindFirst("Id").Value;
            bool canChangeSensitiveData = _httpContextAccessor.HttpContext.User.FindAll(ClaimTypes.Role).Count(x => x.Value == "Admin") > 0;

            User userEntity = new User
            {
                Id = long.Parse(userId),
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
            _service.Update(long.Parse(userId), userEntity, canChangeSensitiveData, true);

            if (user.Id == 0)
            {
                return BadRequest();
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("photo")]
        public IActionResult PhotoUpload()
        {
            IFormFile file = Request.Form.Files[0];

            var userId = User.FindFirst("Id")?.Value;
            long size = file.Length;

            _service.SavePhoto(file, long.Parse(userId));

            return Ok(new { name = file.Name, size });
        }

        [HttpGet]
        [Route("photo")]
        public ActionResult<byte[]> GetPhotos(long photoId)
        {
            var userId = User.FindFirst("Id")?.Value;
            var file = _service.GetById(long.Parse(userId)).Picture;
            if (file != null)
            {
                return File(file, "image/jpeg");
            }
            else
            {
                return null;
            }
        }


        [HttpGet()]
        [Route("Menu")]
        public ActionResult<List<MenuAccount>> GetMenu()
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirst("Id").Value;

                List<MenuAccount> listMenu = new List<MenuAccount>();
                List<MenuTreeViewQuery> listMenuTreeView = _menuRepository
                                            .GetTreeViewMenuFromUser(int.Parse(userId));
                MenuAccount menu = null;
                SubMenu subMenu = null;

                foreach (MenuTreeViewQuery menuTreeView in listMenuTreeView)
                {
                    if (menuTreeView.Level == 0)
                    {
                        menu = new MenuAccount();
                        menu.Items = new List<SubMenu>();
                        menu.Name = menuTreeView.Name;
                        menu.IconClass = menuTreeView.IconClass;
                        listMenu.Add(menu);
                    }

                    if (menuTreeView.Level == 1)
                    {
                        subMenu = new SubMenu();
                        subMenu.Name = menuTreeView.Name;
                        subMenu.Route = menuTreeView.Route;
                        menu.Items.Add(subMenu);
                    }

                    if (menuTreeView.Level == 2)
                    {
                        Item item = new Item();
                        item.Name = menuTreeView.Name;
                        item.Route = menuTreeView.Route;
                        subMenu.SubItems.Add(item);
                    }

                }

                return listMenu;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }

    public class MenuAccount
    {
        public MenuAccount()
        {
            Items = new List<SubMenu>();
        }
        public string Name { get; set; }
        public string IconClass { get; set; }
        public string MobileClass
        {
            get
            {
                if (IconClass == "fa-cog")
                    return "cog";
                else if (IconClass == "fa-chart-pie")
                    return "chart-pie";
                else if (IconClass == "fa-cubes")
                    return "cube";
                else if (IconClass == "fa-badge-check")
                    return "certificate";
                else if (IconClass == "fa-clipboard-list")
                    return "clipboard-list";
                else if (IconClass == "fa-microchip")
                    return "microchip";
                else
                    return "microchip";
            }
        }
        public List<SubMenu> Items { get; set; }

    }
    public class SubMenu
    {
        public SubMenu()
        {
            SubItems = new List<Item>();
        }
        public string Name { get; set; }
        public string Route { get; set; }
        public List<Item> SubItems { get; set; }
    }
    public class Item
    {
        public string Name { get; set; }
        public string Route { get; set; }

    }
}
