using Exceler8_Domain.DTOs;
using Exceler8_Domain.Entities;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin,User")]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        TicketService _service;
        UserService _userService;
        private IHttpContextAccessor _httpContextAccessor;
        public TicketController(TicketService service, UserService userService, IHttpContextAccessor httpContextAccessor)
        {
            _service = service;
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }


        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            return Ok(_service.GetById(id));
        }

        [HttpPost]
        [Route("Register/")]
        public IActionResult Create(CreateTicketDTO ticketDTO)
        {
            var userId = User.FindFirst("Id").Value;

            Ticket ticket = new Ticket()
            {
                UserId = long.Parse(userId),
                Title = ticketDTO.Title,
                Description = ticketDTO.Description,
                RequestDate = DateTime.Now,
                TicketType = ticketDTO.TicketType,
                Priority = ticketDTO.Priority,
                Objectives = ticketDTO.Objectives,
                ExpectedBenefits = ticketDTO.ExpectedBenefits,
                Inputs = ticketDTO.Inputs,
                Outputs = ticketDTO.Outputs,
                Process = ticketDTO.Process,
                Emailcopy = ticketDTO.Emailcopy,
                MenuModuleId = ticketDTO.MenuModuleId,
                MenuScreenId = ticketDTO.MenuScreenId,
                MenuOperationId = ticketDTO.MenuOperationId
            };            
            return Ok(_service.Create(ticket));
        }

        [HttpPost]
        [Route("Save/")]
        public IActionResult Save(TicketsDTO ticketsDTO)
        {
            bool isAdmin = _httpContextAccessor.HttpContext.User.FindAll(ClaimTypes.Role).Count(x => x.Value == "Admin") > 0;
            var userId = User.FindFirst("Id").Value;           

            Ticket ticket = new Ticket()
            {
                Id = ticketsDTO.Id,
                UserId = long.Parse(userId),
                Title = ticketsDTO.Title,
                Description = ticketsDTO.Description,
                TicketType = ticketsDTO.TicketType,
                Priority = ticketsDTO.Priority,
                BugVersion = ticketsDTO.BugVersion,
                ReleaseVersion = ticketsDTO.ReleaseVersion,
                Resolution = ticketsDTO.Resolution,
                Status = ticketsDTO.Status,
                Objectives = ticketsDTO.Objectives,
                ExpectedBenefits = ticketsDTO.ExpectedBenefits,
                Inputs = ticketsDTO.Inputs,
                Outputs = ticketsDTO.Outputs,
                Process = ticketsDTO.Process,
                Emailcopy = ticketsDTO.Emailcopy,
                MenuModuleId = ticketsDTO.MenuModuleId,
                MenuScreenId = ticketsDTO.MenuScreenId,
                MenuOperationId = ticketsDTO.MenuOperationId
            };

            //_service.Save(ticket, isAdmin, ticketsDTO.InformationUpdate);
            return Ok(_service.Save(ticket, isAdmin, ticketsDTO.InformationUpdate));
        }


        [HttpGet]
        [Route("SaveCompleted")]
        public IActionResult SaveCompleted([FromQuery] long ticketId)
        {
            _service.SendEmailNotification(ticketId);
            return Ok();
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("attachment")]
        public IActionResult AttachmentUpload(long ticketId)
        {
            foreach (var file in Request.Form.Files)
            {
                var userId = User.FindFirst("Id")?.Value;
                _service.SaveFile(file, ticketId, long.Parse(userId));
            }

            return Ok();
        }

        [HttpGet]
        [Route("attachment")]
        public ActionResult<byte[]> GetAttachment(long attachmentId)
        {
            var userId = User.FindFirst("Id")?.Value;
            var attach = _service.GetById(attachmentId, long.Parse(userId));
            if (attach.File != null)
            {
                return File(attach.File, attach.MimeType);
            }
            else
            {
                return null;
            }
        }

        [HttpDelete]
        [Route("attachment")]
        public IActionResult DeleteAttachment(long[] attachmentId)
        {
            var userId = User.FindFirst("Id")?.Value;
            _service.DeleteById(attachmentId, long.Parse(userId));
            return Ok();
        }

    }
}
