import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks/me');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Todo': return 'badge-todo';
      case 'In Progress': return 'badge-progress';
      case 'Review': return 'badge-review';
      case 'Done': return 'badge-done';
      default: return 'badge-todo';
    }
  };

  if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card text-center">
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.total}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="card text-center">
          <h3 style={{ fontSize: '2rem', color: 'var(--warning)' }}>{stats.todo + stats.inProgress}</h3>
          <p>Active Tasks</p>
        </div>
        <div className="card text-center">
          <h3 style={{ fontSize: '2rem', color: 'var(--success)' }}>{stats.done}</h3>
          <p>Completed</p>
        </div>
      </div>

      <h3 className="mt-4 mb-2">Your Tasks</h3>
      {tasks.length === 0 ? (
        <div className="card text-center">
          <p>You don't have any tasks assigned yet.</p>
        </div>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {tasks.map(task => (
            <div key={task._id} className="card">
              <div className="flex justify-between items-center mb-2">
                <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
                {task.dueDate && (
                  <span className="flex items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    <Calendar size={14} /> 
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>{task.title}</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{task.description}</p>
              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Project: {task.project?.name || 'Unknown'}</span>
                {task.project ? (
                  <Link to={`/projects/${task.project._id}`} className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>View Board</Link>
                ) : (
                  <button className="btn btn-outline btn-sm" disabled>No Project</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
