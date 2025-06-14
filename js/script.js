document.addEventListener('DOMContentLoaded', () => {
	const taskInput = document.getElementById('taskInput');
	const addTaskBtn = document.getElementById('addTaskBtn');
	const taskList = document.getElementById('taskList');

	// завдання - localStorage або порожній масив
	let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

	// Зберігає завдання у localStorage.
	function saveTasks() {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	// Відображає завдання
	function renderTasks() {
		taskList.innerHTML = '';
		if (tasks.length === 0) {
			// повідомлення, якщо завдань немає
			const noTasksMessageSpan = document.createElement('span');
			noTasksMessageSpan.textContent = 'Немає завдань. Додайте нове!';
			const noTasksMessage = document.createElement('li');
			noTasksMessage.classList.add('noTasksMessage');
			noTasksMessage.appendChild(noTasksMessageSpan);
			taskList.appendChild(noTasksMessage);
			return;
		}

		// створюємо DOM-елементи для завдань
		tasks.forEach((task, index) => {
			const li = document.createElement('li');
			li.setAttribute('data-index', index); // індекс для управління
			const taskTextSpan = document.createElement('span');
			taskTextSpan.textContent = task.text;

			// обробник кліку для перемикання статусу "виконано"
			li.addEventListener('click', () => toggleTaskCompleted(index));
			
			if (task.completed) {
				li.classList.add('completed');
			}

			// кнопка "видалити" і обробник
			const deleteBtn = document.createElement('button');
			deleteBtn.textContent = 'Видалити';
			deleteBtn.addEventListener('click', (event) => {
				event.stopPropagation(); // зупиняємо розповсюдження події, щоб не спрацьовував клік на span
				deleteTask(index);
			});
			
			li.appendChild(taskTextSpan);
			li.appendChild(deleteBtn);
			taskList.appendChild(li);
		});
	}

	// Додає нове завдання до списку
	function addTask() {
		const taskText = taskInput.value.trim();
		if (taskText !== '') {
			tasks.unshift({ text: taskText, completed: false });
			taskInput.value = '';
			saveTasks();
			renderTasks();
		} else {
			// підказка
			taskInput.style.borderColor = '#e74c3c';
			taskInput.placeholder = 'Будь ласка, введіть завдання!';
			setTimeout(() => {
				taskInput.style.borderColor = '#c8d6e5';
				taskInput.placeholder = 'Додати нове завдання...';
			}, 1500);
		}
	}

	// Перемикає статус "виконано" для завдання за індексом
	function toggleTaskCompleted(index) {
		if (index >= 0 && index < tasks.length) {
			tasks[index].completed = !tasks[index].completed;
			saveTasks();
			renderTasks();
		}
	}

	// Видаляє завдання зі списку за індексом
	function deleteTask(index) {
		if (index >= 0 && index < tasks.length) {
			tasks.splice(index, 1);
			saveTasks();
			renderTasks();
		}
	}

	// Обробник події для кнопки "Додати"
	addTaskBtn.addEventListener('click', addTask);

	// Обробник події для поля введення
	taskInput.addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			addTask();
		}
	});

	renderTasks();
});