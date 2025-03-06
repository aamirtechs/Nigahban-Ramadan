import React from "react";

const SearchTable = ({ data }) => {
  return (
    <div className="card shadow-lg p-4" style={{ backgroundColor: "white" }}>
      <h4 className="card-title text-center text-success">🔍 Search Results</h4>
      <table className="table table-bordered mt-3">
        <thead className="table-success">
          <tr>
            <th>Name</th>
            <th>Mobile No</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Name}</td>
              <td>{item.MobileNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchTable;
