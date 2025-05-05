using Microsoft.AspNetCore.Mvc;
using ToDo.Data;
using ToDo.Models;

namespace ToDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TodoApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TodoApi
        [HttpGet]
        public ActionResult<IEnumerable<Models.ToDo>> GetTodos()
        {
            return Ok(_context.ToDos.ToList());
        }

        // GET: api/TodoApi/5
        [HttpGet("{id}")]
        public ActionResult<Models.ToDo> GetTodo(int id)
        {
            var todo = _context.ToDos.FirstOrDefault(x => x.Id == id);

            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }

        // POST: api/TodoApi
        [HttpPost]
        public ActionResult<Models.ToDo> CreateTodo(Models.ToDo todo)
        {
            _context.ToDos.Add(todo);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }

        // PUT: api/TodoApi/5
        [HttpPut("{id}")]
        public IActionResult UpdateTodo(int id, Models.ToDo todo)
        {
            if (id != todo.Id)
            {
                return BadRequest();
            }

            var existingTodo = _context.ToDos.FirstOrDefault(x => x.Id == id);
            if (existingTodo == null)
            {
                return NotFound();
            }

            existingTodo.Title = todo.Title;
            existingTodo.Details = todo.Details;
            existingTodo.Date = todo.Date;
            existingTodo.IsDone = todo.IsDone;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/TodoApi/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTodo(int id)
        {
            var todo = _context.ToDos.FirstOrDefault(x => x.Id == id);
            if (todo == null)
            {
                return NotFound();
            }

            _context.ToDos.Remove(todo);
            _context.SaveChanges();

            return NoContent();
        }

        // PATCH: api/TodoApi/5/toggle
        [HttpPatch("{id}/toggle")]
        public IActionResult ToggleTodo(int id)
        {
            var todo = _context.ToDos.FirstOrDefault(x => x.Id == id);
            if (todo == null)
            {
                return NotFound();
            }

            todo.IsDone = !todo.IsDone;
            _context.SaveChanges();

            return Ok(todo);
        }
    }
}