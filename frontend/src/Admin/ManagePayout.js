import React, { useEffect, useState } from "react";
import "./ManagePayout.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers } from "../Services/Actions/userAction"; // Adjust the path based on your project structure
import Loader from "../components/Loading"; // A loader component if you have one
import axios from "axios"; // You need to install axios if you haven't
import Modal from "react-modal";

const ManagePayout = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin); // Assuming adminReducer is used for state management
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedGiftCardOptions, setSelectedGiftCardOptions] = useState({});
  const handleGiftCardOptionChange = (userId, gigId, value) => {
    setSelectedGiftCardOptions((prevOptions) => ({
      ...prevOptions,
      [`${userId}-${gigId}`]: value,
    }));
  };

  useEffect(() => {
    dispatch(loadAllUsers());
  }, [dispatch]);

  const handleSendEmail = async () => {
    if (!email) {
      setPopupMessage("Please enter an email address.");
      return;
    }

    try {
      // Inline styles
      const styles = `
        <style>
          .user-payout-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .user-payout-table th, .user-payout-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .user-payout-table th {
            background-color: #f4f4f4;
            color: #333;
          }
          .user-payout-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .user-payout-table tbody tr:hover {
            background-color: #f1f1f1;
          }
          .status-requested {
            color: #ff9800; /* Orange color for 'requested' status */
            background-color: #fff3e0; /* Light orange background */
          }
          .status-approved {
            color: #4caf50; /* Green color for 'approved' status */
            background-color: #e8f5e9; /* Light green background */
          }
          .status-not-requested {
            color: #9e9e9e; /* Gray color for 'not requested' status */
            background-color: #e0e0e0; /* Light gray background */
          }
          .payment-select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fff;
          }
          .btn-info {
            background-color: #007bff; /* Blue color for the button */
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .btn-info:hover {
            background-color: #0056b3; /* Darker blue on hover */
          }
          .btn-info:disabled {
            background-color: #ccc; /* Gray color for disabled button */
            cursor: not-allowed;
          }
        </style>
      `;

      // Get table HTML
      const tableDataHtml = document.querySelector(".user-payout-table").outerHTML;
      const emailBody = `${styles}<div>${tableDataHtml}</div>`;

      await axios.post(
        "aak/l1/send-email",
        { email, tableData: emailBody },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPopupMessage(`Table data sent successfully to ${email}`);
    } catch (error) {
      setPopupMessage("Failed to send table data.");
    }
  };

  // Function to handle gift card approval
  // Function to handle gift card approval
  const handleApproveGiftCard = async (userId, gigId, userName, userEmail) => {
    try {
      const giftCardOption = selectedGiftCardOptions[`${userId}-${gigId}`];

      // Check if giftCardOption is not selected or set to "None"
      if (!giftCardOption || giftCardOption === "") {
        setPopupMessage("Please select a gift card option before approving.");
        return;
      }

      await axios.put(
        `aak/l1/admin/gift-card/approve/${userId}/${gigId}`,
        { giftCardOption }, // Send giftCardOption in the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPopupMessage(
        `Payout request for ${userName} has been approved, and the payout has been sent to ${userEmail}.`
      );
      dispatch(loadAllUsers());
    } catch (error) {
      console.error("Error approving gift card:", error);
      setPopupMessage("Failed to approve gift card.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="manage-user-payout">
      {loading && <Loader />}
      <h1>Manage Payout</h1>
      {users && users.length > 0 ? (
        <table className="user-payout-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Study Title</th>
              <th>Budget</th>
              <th>Study Status</th>
              <th>Payment Status</th>
              <th>Payout Option</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.flatMap((user) =>
              user.gigs.map((gig, index) => (
                <tr key={`${user._id}-${gig._id}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={user.gigs.length}>{user.name}</td>
                      <td rowSpan={user.gigs.length}>{user.email}</td>
                    </>
                  )}
                  <td>{gig.title}</td>

                  <td>${gig.budget}</td>
                  <td>{gig.status}</td>
                  <td
                    className={
                      gig.paymentStatus === "requested"
                        ? "status-requested"
                        : gig.paymentStatus === "approved"
                        ? "status-approved"
                        : "status-not-requested"
                    }
                  >
                    {gig.paymentStatus}
                  </td>

                  <td>
                    <select
                      className="payment-select"
                      value={selectedGiftCardOptions[`${user._id}-${gig._id}`] || gig.giftCardOption || ""}
                      onChange={(e) => handleGiftCardOptionChange(user._id, gig._id, e.target.value)}
                    >
                      <option value="">None</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                      <option value="amazon">Amazon</option>
                      <option value="starbucks">Starbucks</option>
                      <option value="burgerKing">BurgerKing</option>
                      <option value="dominos">Domino's</option>
                      <option value="apple">Apple</option>
                      <option value="walmart">Walmart</option>
                      <option value="uber">Uber</option>
                      <option value="airbnb">Airbnb</option>
                    </select>
                  </td>
                  <td>
                    {gig.paymentStatus !== "approved" && (
                      <button
                        className="btn btn-info"
                        onClick={() => handleApproveGiftCard(user._id, gig._id, user.name, user.email)}
                      >
                        Approve ${gig.budget}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
      <div className="sendmail">
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-info" onClick={handleSendEmail}>
          Send Table Data
        </button>
      </div>

      <Modal
        isOpen={!!popupMessage}
        onRequestClose={() => setPopupMessage("")}
        className="popup-modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <h2>Notification</h2>
          <p>{popupMessage}</p>
          <button className="btn btn-info" onClick={() => setPopupMessage("")}>
            Close
          </button>
        </div>
      </Modal>

      {/* add here field so admin take email address send button after click on that button all the data in table will send to specfic email address in form of table as it is in table so i will need to make backend route and api in usercontroller for that as well */}
    </div>
  );
};

export default ManagePayout;
