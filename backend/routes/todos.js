const router = require('express').Router();
const {
  getTodos, getTodoById, createTodo, updateTodo, deleteTodo, bulkDelete,
} = require('../controllers/todoController');
const { authenticate } = require('../middleware/auth');
const {
  createTodoValidation, updateTodoValidation, getTodosValidation,
} = require('../validations/todoValidation');

router.use(authenticate);

router.get('/', getTodosValidation, getTodos);
router.post('/', createTodoValidation, createTodo);
router.delete('/bulk', bulkDelete);
router.get('/:id', getTodoById);
router.put('/:id', updateTodoValidation, updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
