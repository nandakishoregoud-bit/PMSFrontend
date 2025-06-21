import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskScreen.css"; // You can customize this CSS or inline it

export const BASE_URL = 'http://localhost:8080/api'

const TaskScreen = ({ employeeId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTaskData, setEditTaskData] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [searchError, setSearchError] = useState("");
    const [statusUpdates, setStatusUpdates] = useState({});
    const [expandedTasks, setExpandedTasks] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    const [searchField, setSearchField] = useState("task"); // default filter field
    const [searchText, setSearchText] = useState("");

      const [showCommentModal, setShowCommentModal] = useState(false);
        const [selectedTask, setSelectedTask] = useState(null);
        const [commentText, setCommentText] = useState("");
        const [comments, setComments] = useState([]);


    const empId = localStorage.getItem("empId");

    const [newTask, setNewTask] = useState({
        task: "",
        description: "",
        assignedToEmployeeId: [],
        status: "Pending",
        assignedDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        assignedBy: empId,
    });

    
    const currentTasks = tasks.filter((task) => {
        const value = task[searchField]?.toString().toLowerCase();
        return value?.includes(searchText.toLowerCase());
    });
    
      
    const [totalPages, setTotalPages] = useState(0);

    const changePage = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchTasks(newPage - 1); // Convert 1-based UI page to 0-based backend page
        }
    };
    
    useEffect(() => {
        fetchTasks(0);
    }, [employeeId]);

    const fetchTasks = async (page = 0) => {
        const token = localStorage.getItem('token');
        const emplId = localStorage.getItem("empId");

        try {
            const response = await axios.get(`${BASE_URL}/tasks/${emplId}/all`, {
                params: { page, size: tasksPerPage },
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(response.data.content); // Page content
            setTotalPages(response.data.totalPages); // Total pages
            setCurrentPage(page + 1); // Page is 0-based in backend
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = async (taskId) => {
        const token = localStorage.getItem('token');
        const emplId = localStorage.getItem("empId");
        try {
            await axios.delete(`${BASE_URL}/tasks/${emplId}/delete/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter(task => task.id !== taskId));
            alert("Deleted Succussfully");
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleEdit = (task) => {
        setEditTaskData({ ...task });
        setAssignedEmployees(task.assignedToEmployeeId?.map(id => ({ empId: id })) || []);
        setShowEditModal(true);
    };

    const handleSearchEmployee = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}/admin/employees/employees?search=${searchInput}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const matches = res.data;

            if (!matches.length) {
                setSearchResults([]);
                setSearchError("No matching employees found.");
                return;
            }

            setSearchResults(matches);
            setSearchError("");
        } catch (error) {
            console.error("Search failed", error);
            setSearchError("Error searching employee");
        }
    };
    const handleAddEmployee = (employee) => {
        if (assignedEmployees.some(e => e.empId === employee.empId)) {
            setSearchError("Employee already added.");
            return;
        }
        setAssignedEmployees([...assignedEmployees, employee]);
        setSearchResults([]); // optionally clear search results after adding
        setSearchInput("");
        setSearchError("");
    };
        
    

    const handleCreate = async () => {
        const token = localStorage.getItem('token');
        const assignedIds = assignedEmployees.map(emp => emp.empId);

        try {
            const response = await axios.post(
                `${BASE_URL}/tasks/createtask`,
                { ...newTask, assignedToEmployeeId: assignedIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data]);
            setShowCreateModal(false);
            setNewTask({
                task: "",
                description: "",
                assignedToEmployeeId: [],
                status: "Pending",
                assignedDate: new Date().toISOString().split("T")[0],
                dueDate: "",
                assignedBy: empId,
            });
            setAssignedEmployees([]);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const submitEdit = async () => {
        const token = localStorage.getItem("token");
        const assignedIds = assignedEmployees.map(emp => emp.empId);
        const emplId = localStorage.getItem("empId");
        try {
            const response = await axios.put(
                `${BASE_URL}/tasks/${emplId}/update/${editTaskData.id}`,
                { ...editTaskData, assignedToEmployeeId: assignedIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedTasks = tasks.map(t => (t.id === editTaskData.id ? response.data : t));
            setTasks(updatedTasks);
            setShowEditModal(false);
            setEditTaskData(null);
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };
    const handleStatusChange = (taskId, newStatus) => {
        setStatusUpdates(prev => ({ ...prev, [taskId]: newStatus }));
    };

    const openCommentModal = async (task) => {
        setSelectedTask(task);
        setCommentText("");
        setShowCommentModal(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/tasks/${task.id}/all/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(response.data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;
        const token = localStorage.getItem("token");
        const newComment = {
            submittedBy: empId,
            taskId: selectedTask.id,
            task: selectedTask.task,
            comment: commentText,
            submittedDate: new Date().toISOString()
        };
        try {
            const response = await axios.post(`${BASE_URL}/comments/post`, newComment, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(prev => [...prev, response.data]);
            setCommentText("");
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("token");
        const emplId = localStorage.getItem("empId");
        try {
            await axios.delete(`${BASE_URL}/comments/${emplId}/delete/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };



    const handleStatusUpdate = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = statusUpdates[taskId];
            if (!newStatus) return;

            await axios.put(
                `${BASE_URL}/tasks/${taskId}/updateStatus?status=${newStatus}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatusUpdates(prev => ({ ...prev, [taskId]: undefined }));
            fetchTasks();
        } catch (err) {
            alert('Error updating status.');
        }
    };

    const renderModalForm = (isEdit = false) => {
        const taskData = isEdit ? editTaskData : newTask;
        const handleChange = (e) => {
            const { name, value } = e.target;
            if (isEdit) setEditTaskData({ ...editTaskData, [name]: value });
            else setNewTask({ ...newTask, [name]: value });
        };

        
        return (
            <div className="modal-overlay">

                <div className="modal-content">
                    <h3>{isEdit ? "Edit Task" : "New Task"}</h3>
                    <strong>Task Name:</strong>
                    <input name="task" value={taskData.task} onChange={handleChange} placeholder="Task title" />
                    <strong>Description:</strong>
                    <textarea name="description" value={taskData.description} onChange={handleChange} placeholder="Description" />
                    <strong>Select Employee by ID or Name:</strong>
                    <input
                        placeholder="Enter Employee ID or Name"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button onClick={handleSearchEmployee}>Search</button>

                    {searchError && <p style={{ color: "red" }}>{searchError}</p>}

                    {/* 🔍 Search Results */}
                    {searchResults.length > 0 && (
                        <div>
                            <h4>Search Results:</h4>
                            <ul>
                                {searchResults.map((emp) => (
                                    <li key={emp.empId}>
                                        <strong>{emp.empId}</strong> - {emp.name}
                                        <button onClick={() => handleAddEmployee(emp)} style={{ marginLeft: "10px" }}>
                                            Add
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ✅ Assigned Employees */}
                    {assignedEmployees.length > 0 && (
                        <div>
                            <h4>Assigned Employees:</h4>
                            <ul>
                                {assignedEmployees.map((emp) => (
                                    <li key={emp.empId}>
                                        <strong>{emp.empId}</strong> - {emp.name}
                                        <button
                                            onClick={() =>
                                                setAssignedEmployees(
                                                    assignedEmployees.filter(e => e.empId !== emp.empId)
                                                )
                                            }
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    <strong>Due Date:</strong>
                    <input name="dueDate" type="date" value={taskData.dueDate} onChange={handleChange} />
                    <strong>Status:</strong>
                    <select name="status" value={taskData.status} onChange={handleChange}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="modal-actions">
                        <button onClick={isEdit ? submitEdit : handleCreate}>
                            {isEdit ? "Update" : "Submit"}
                        </button>
                        <button onClick={() => isEdit ? setShowEditModal(false) : setShowCreateModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="task-container">
            <div className="headertask">
            <div className="filter-bar">
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                >
                    <option value="task">Task Title</option>
                    <option value="status">Status</option>
                    <option value="assignedDate">Assigned Date</option>
                    <option value="dueDate">Due Date</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ padding: "5px" }}
                />
                
            </div>

            <h2>Stores Issued by You</h2>
                <button className="create-button" onClick={() => setShowCreateModal(true)}>+ Create Task</button>
            </div>
            {showCreateModal && renderModalForm(false)}
            {showEditModal && editTaskData && renderModalForm(true)}

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div className="task-grid">
                        {currentTasks.map(task => (
                        <div className="task-card" key={task.id}>
                            <h3>{task.task}</h3>
                            <p><strong>Description:</strong>
                                {task.description && expandedTasks?.id === task.id ? (
                                    <>
                                        <span>{task.description}</span>
                                        <button
                                            onClick={() => setExpandedTasks(null)}
                                            style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '5px' }}
                                        >
                                            Show less
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            {task.description.slice(0, 200)}...
                                            <button
                                                onClick={() => setExpandedTasks(task)}
                                                style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '5px' }}
                                            >
                                                Read more
                                            </button>
                                        </span>
                                    </>
                                )}
                                </p>
                                <p><strong>Assigned By:</strong> {task.assignedBy}</p>
                            <p><strong>Assigned To:</strong> {task.assignedToEmployeeId.join(", ")}</p>
                            
                            
                            <p><strong>Assigned On:</strong> {task.assignedDate}</p>
                            <p><strong>Due:</strong> {task.dueDate}</p>
                            <p><strong>Status:</strong>{task.status}</p>
                            <div className="card-actions">
                                <select
                                    value={statusUpdates[task.id] || task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    style={{
                                        width: '10%',
                                        padding: '5px',
                                        marginTop: '5px'
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <button
                                    onClick={() => handleStatusUpdate(task.id)}
                                    style={{
                                        marginTop: '10px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        padding: '6px 12px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Update Status
                                </button>
                                <button className="edit-button" onClick={() => handleEdit(task)} >Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(task.id)} >Delete</button>
                                </div>
                                <button onClick={() => openCommentModal(task)} style={{ marginTop: '10px' }}>
                                    💬 Comment's
                                </button>
                        </div>

                        
                    ))}
                        
                        
                </div>
                
            )}
            {totalPages > 1 && (
                <div style={styles.pagination}>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            style={{
                                ...styles.pageButton,
                                backgroundColor: currentPage === index + 1 ? '#2563eb' : '#e5e7eb',
                                color: currentPage === index + 1 ? '#fff' : '#000',
                                cursor: 'pointer',
                                margin: '0 5px',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '5px',
                            }}
                            onClick={() => changePage(index + 1)} // Keep your function name consistent
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
            {showCommentModal && selectedTask && (
                <div className="comment-modal">
                    <div className="comment-modal-content">
                        <h3>Comments for: {selectedTask.task}</h3>

                        <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px' }}>
                            {comments.length > 0 ? comments.map(c => (
                                <div key={c.id} className="comment-box">
                                    <p><strong>{c.submittedBy}</strong>: {c.comment}</p>
                                    {c.submittedBy === empId && (
                                        <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
                                    )}
                                </div>
                            )) : (
                                <p>No comments yet.</p>
                            )}
                        </div>

                        <textarea
                            placeholder="Write your comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows="3"
                            style={{ width: '100%', padding: '10px' }}
                        />

                        <div style={{ marginTop: '10px' }}>
                            <button onClick={handleSubmitComment}>Submit</button>
                            <button onClick={() => setShowCommentModal(false)} style={{ marginLeft: '10px' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskScreen;

const styles = {
    pagination: {
        marginTop: '30px',
        textAlign: 'center',
    },
    pageButton: {
        margin: '0 5px',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
    }
};