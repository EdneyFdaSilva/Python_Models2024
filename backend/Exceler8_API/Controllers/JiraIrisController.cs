using Exceler8_Domain.DTOs;
using Exceler8_Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Exceler8_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize("Bearer", Roles = "User")]
    public class JiraIrisController : ControllerBase
    {
        private readonly JiraIrisService _jiraIrisService;

        public JiraIrisController(JiraIrisService jiraIrisService)
        {
            _jiraIrisService = jiraIrisService;
        }

        [HttpPost]
        [Route("GetModule")]
        public IActionResult GetModule([FromBody] JiraIrisFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetModule(filters));
        }

        [HttpPost]
        [Route("GetArea")]
        public IActionResult GetAreaJiraIris([FromBody] JiraIrisFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetArea(filters));
        }

        [HttpPost]
        [Route("GetOperation")]
        public IActionResult GetOperation([FromBody] JiraIrisFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetOperation(filters));
        }

        [HttpPost]
        [Route("GetOwner")]
        public IActionResult GetOwner([FromBody] JiraIrisFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetOwner(filters));
        }

        [HttpPost]
        [Route("GetManager")]
        public IActionResult GetManager()
        {
            return Ok(_jiraIrisService.GetManager());
        }

        [HttpPost]
        [Route("GetPriority")]
        public IActionResult GetPriority()
        {
            return Ok(_jiraIrisService.GetPriority());
        }

        [HttpPost]
        [Route("GetSprint")]
        public IActionResult GetSprint()
        {
            return Ok(_jiraIrisService.GetSprint());
        }

        [HttpPost]
        [Route("GetRequestBurndownChart")]
        public IActionResult GetRequestBurndownChart([FromBody] JiraIrisFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetRequestBurndownChart(filters));
        }

        [HttpPost]
        [Route("GetRequestBurndownChartTable")]
        public IActionResult GetRequestBurndownChartTable([FromBody] JiraIrisFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetRequestBurndownChartTable(filters));
        }

        [HttpPost]
        [Route("GetSprintsPlanning")]
        public IActionResult GetSprintsPlanning()
        {
            return Ok(_jiraIrisService.GetSprintsPlanning());
        }

        [HttpPost]
        [Route("GetSummaryByModule")]
        public IActionResult GetSummaryByModule()
        {
            return Ok(_jiraIrisService.GetSummaryByModule());
        }

        [HttpPost]
        [Route("GetSummaryByManager")]
        public IActionResult GetSummaryByManager()
        {
            return Ok(_jiraIrisService.GetSummaryByManager());
        }

        [HttpPost]
        [Route("GetSchedulePlanning")]
        public IActionResult GetSchedulePlanning([FromBody] ScheduleFiltersDTO filters)
        {
            return Ok(_jiraIrisService.GetSchedulePlanning(filters));
        }

        [HttpGet]
        [Route("GetProject")]
        public IActionResult GetProject()
        {
            return Ok(_jiraIrisService.GetProject());
        }

        [HttpGet]
        [Route("GetSprintSchedule")]
        public IActionResult GetSprintSchedule()
        {
            return Ok(_jiraIrisService.GetSprintSchedule());
        }

        [HttpGet]
        [Route("GetFieldDate")]
        public IActionResult GetFieldDate()
        {
            return Ok(_jiraIrisService.GetFieldDate());
        }
    }
}