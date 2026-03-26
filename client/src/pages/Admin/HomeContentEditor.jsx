import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";

export default function HomeContentEditor() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axiosClient.get("/home-content").then(res => {
      setContent(res.data);
    });
  }, []);

  const updateDepartment = (i, key, value) => {
    const updated = [...content.departmentScopes];
    updated[i][key] = value;
    setContent({ ...content, departmentScopes: updated });
  };

  const addDepartment = () => {
    setContent({
      ...content,
      departmentScopes: [
        ...content.departmentScopes,
        { department: "", description: "" },
      ],
    });
  };

  const save = async () => {
    await axiosClient.put("/home-content", content);
    alert("Home page content updated");
  };

  if (!content) return null;

  return (
    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      <h2>Home Page Content</h2>

      <h3>About Atria</h3>
      <textarea
        rows={5}
        value={content.aboutAtria}
        onChange={e =>
          setContent({ ...content, aboutAtria: e.target.value })
        }
        style={{ width: "100%" }}
      />

      <h3 style={{ marginTop: 20 }}>Department-wise Activity Scope</h3>

      {content.departmentScopes.map((d, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <input
            placeholder="Department Name"
            value={d.department}
            onChange={e =>
              updateDepartment(i, "department", e.target.value)
            }
            style={{ width: "100%", marginBottom: 5 }}
          />

          <textarea
            placeholder="Activity Scope Description"
            rows={4}
            value={d.description}
            onChange={e =>
              updateDepartment(i, "description", e.target.value)
            }
            style={{ width: "100%" }}
          />
        </div>
      ))}

      <button onClick={addDepartment}>+ Add Department</button>
      <br /><br />
      <button onClick={save}>Save Changes</button>
    </div>
  );
}
