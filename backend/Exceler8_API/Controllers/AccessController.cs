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
using Exceler8_Domain.DTOs.HighchartsDTO;

namespace Exceler8_API.Controllers
{
    [Authorize("Bearer", Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccessController : ControllerBase
    {
        AuditService _auditService;

        private IHttpContextAccessor _httpContextAccessor;

        public AccessController(AuditService auditService,
                                 IHttpContextAccessor httpContextAccessor)
        {
            _auditService = auditService;
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        [HttpGet()]
        [Route("AccessList")]
        public ActionResult<List<AccessListDTO>> GetAccessList()
        {
            return _auditService.ListAccess(DateTime.Now.AddYears(-2), DateTime.Now);
        }
        
        [HttpGet()]
        [Route("EndpointList")]
        public ActionResult<List<EndpointMetricsDTO>> EndpointList()
        {
            return _auditService.ListEnpointMetricsDTO(DateTime.Now.AddDays(-7), DateTime.Now);
        }
        [HttpGet()]
        [Route("EndpointChart")]
        public ActionResult<LineHighchartsDTO> EndpointChart(string path)
        {
            return _auditService.ChartEndpointTime(DateTime.Now.AddDays(-7), DateTime.Now, path);
        }
    }
}