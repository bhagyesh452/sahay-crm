import React from "react";
import myImage from "../static/nodatalogo.png";

function LoginDetails({ loginDetails }) {
  return (
    <div>
      <div className="container-xl">
        <div className="card mt-2">
          <div className="card-body p-0">
            <div style={{ overflowX: "auto" }}>
              {loginDetails.length !== 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginDetails.map((details, index) => (
                      <tr key={index}>
                        <td>{details.ename}</td>
                        <td>{details.date}</td>
                        <td>{details.time}</td>
                        <td>{details.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  <img src={myImage} alt="myImage" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDetails;
