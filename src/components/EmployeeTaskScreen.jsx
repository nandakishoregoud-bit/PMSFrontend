import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manTask.css"; // You can customize this CSS or inline it

export const BASE_URL = 'http://localhost:8080/api'

const EmployeeTaskScreen = ({ employeeId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTasks, setExpandedTasks] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    const [searchField, setSearchField] = useState("task"); // default filter field
    const [searchText, setSearchText] = useState("");

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    

    const empId = localStorage.getItem("empId");

    

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;

    const filteredTasks = tasks.filter((task) => {
        const value = task[searchField]?.toString().toLowerCase();
        return value?.includes(searchText.toLowerCase());
    });

    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    const changePage = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, [employeeId]);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const emplId = localStorage.getItem("empId");
        try {
            const response = await axios.get(`${BASE_URL}/tasks/employee/${emplId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Sort tasks: latest assignedDate first
            const sortedTasks = response.data.sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate));

            setTasks(sortedTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
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
        try {
            await axios.delete(`${BASE_URL}/comments/${empId}/delete/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };
    
    

    
    

    return (
        <div className="task-container">
            <div className="header">
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

                <h2>Stores Issued To You</h2>
            </div>


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
                            
                            <button onClick={() => openCommentModal(task)} style={{ marginTop: '10px' }}>
                                💬 Comment
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

export default EmployeeTaskScreen;

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