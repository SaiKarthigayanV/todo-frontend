import { useEffect, useState } from "react"

export default function Todo() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = import.meta.env.REACT_APP_API_URL;

    const handleSubmit = () => {
        setError("")
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todo", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }])
                    setTitle("")
                    setDescription("")
                    setMessage("Item Added Successfully...")
                    setTimeout(() => {
                        setMessage("");
                    }, 3000)
                } else {
                    setError("Unable tp create Todo Item...")
                }
            }).catch(() => {
                setError("Unable tp create Todo Item...")
            })
        }
    }

    useEffect(() => {
        getItems()
        // eslint-disable-next-line
    }, [])

    const getItems = () => {
        fetch(apiUrl + "/todo")
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                setTodos(res)
            })
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("");

        if (editTitle.trim() && editDescription.trim()) {
            fetch(`${apiUrl}/todo/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription
                })
            })
                .then(res => res.json())
                .then(updatedTodo => {
                    setTodos(todos.map(item =>
                        item._id === editId ? updatedTodo : item
                    ));
                    setEditId(-1);
                })
                .catch(() => setError("Update failed"));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are You Sure you want to delete this task...")) {
            fetch(`${apiUrl}/todo/${id}`, {
                method: "DELETE"
            })
                .then(() => {
                    setTodos(todos.filter(item => item._id !== id))
                })
                .catch(() => setError("Delete failed"))
        }
    }



    const handleEditCancel = () => {
        setEditId(-1)
    }

    return <> <div className="row p-3 bg-dark text-light m-5">
        <h1>Storm's Notebook</h1>
    </div>

        <div className="row">
            <h3>Add Note</h3>
            {message && <p className="text-success">Note Added Successfully</p>}
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" />
                <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>

        <div className="row mt-3">
            <h3>NOTES</h3>
            <ul className="list-group">
                {
                    todos.map((item) =>
                        <li key={item._id} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center my-2">
                            <div className="d-flex flex-column me-2">
                                {
                                    editId === -1 || editId !== item._id ? <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span>{item.description}</span>
                                    </> : <>
                                        <div className="form-group d-flex gap-2">
                                            <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                                            <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                                        </div>
                                    </>
                                }
                            </div>

                            <div className="d-flex gap-2">
                                {editId === -1 || editId !== item._id ? <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> : <button onClick={handleUpdate}>Update</button>}
                                {editId === -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
                                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>

    </>
}