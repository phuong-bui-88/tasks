import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    email: ''
  });
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, task);
      navigate('/');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="mt-4">
      <h2>Create New Task</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a title.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={task.description}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a due date.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email for Notifications</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={task.email}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            You will receive email notifications when this task is overdue.
          </Form.Text>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            Create Task
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateTask;
