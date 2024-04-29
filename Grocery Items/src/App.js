import "./index.css";
import List from "./List";
import Alert from "./Alert";
import { useState, useEffect } from "react";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [editId, setEditId] = useState(null);

  const [isEditing, setisEditing] = useState(false);
  const [alert, setAlert] = useState({
    show: true,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //* Display ALert
      showAlert(true, "Please Enter the value", "danger");
    } else if (name && isEditing) {
      //* Deal with the edit

      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );

      setName("");
      setEditId(null);
      setisEditing(false);
    } else {
      //* show alert

      showAlert(true, "item Added", "success");

      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const showAlert = (show = false, msg, type) => {
    setAlert({ show: show, msg: msg, type: type });
  };

  const clearList = () => {
    setAlert(true, "item cleared", "danger");
    setList([]);
  };

  const removeSingleItem = (id) => {
    showAlert(true, "item Removed", "danger");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setisEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  return (
    <div className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery checkList</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eg: eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List
            items={list}
            removeitems={removeSingleItem}
            editItem={editItem}
          />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
