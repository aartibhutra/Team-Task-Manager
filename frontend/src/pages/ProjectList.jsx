import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Folder, Plus, Users } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading projects...</div>;

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Projects</h2>
          <p>Manage your team's projects</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newProject.name} 
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={newProject.description} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {projects.length === 0 ? (
        <div className="card text-center">
          <Folder size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Projects Found</h3>
          <p>Get started by creating a new project.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {projects.map(project => (
            <div key={project._id} className="card flex flex-col" style={{ overflow: 'hidden' }}>
              <div className="flex justify-between items-center mb-2">
                <span className={`badge ${project.status === 'Active' ? 'badge-progress' : 'badge-todo'}`}>{project.status}</span>
              </div>
              <h3 style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}>{project.name}</h3>
              <p style={{ marginBottom: '1rem', flex: 1, wordBreak: 'break-word' }}>{project.description}</p>
              
              <div className="flex justify-between items-center mt-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                  <Users size={14} /> {project.teamMembers?.length || 0} Members
                </div>
                <Link to={`/projects/${project._id}`} className="btn btn-primary btn-sm">View Board</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectList;
