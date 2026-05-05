import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, ChevronRight, Calendar, ArrowLeft } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjectData();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [id, user]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/${id}`),
        axios.get(`http://localhost:5000/api/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000http://localhost:5000/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/tasks/project/${id}`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchProjectData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading project...</div>;
  if (!project) return <div className="text-center mt-4">Project not found</div>;

  const columns = ['Todo', 'In Progress', 'Review', 'Done'];

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 text-muted mb-2" style={{ fontSize: '0.875rem' }}>
            <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
              <ArrowLeft size={14} /> Back to Projects
            </Link> 
            <ChevronRight size={14} /> <span>{project.name}</span>
          </div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        {(user?.role === 'Admin' || project.owner?._id === user?._id) && (
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <div className="board">
        {columns.map(col => (
          <div key={col} className="board-column">
            <div className="column-header">
              <span className="column-title">{col}</span>
              <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            
            {tasks.filter(t => t.status === col).map(task => (
              <div key={task._id} className="card" style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{task.title}</h4>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-muted mb-2" style={{ fontSize: '0.75rem' }}>
                    <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                {task.assignedTo && (
                  <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid var(--border)', fontSize: '0.8rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                      {task.assignedTo.name.charAt(0)}
                    </div>
                    <span>{task.assignedTo.name}</span>
                  </div>
                )}
                
                {/* Status Update Dropdown */}
                <div className="mt-2 text-right">
                  <select 
                    className="form-control" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', display: 'inline-block' }}
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  >
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select 
                  className="form-control" 
                  value={newTask.assignedTo} 
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={newTask.dueDate} 
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;
