import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import caseData from "../data/case.json";
import "../styles/casespage.css";

const CasesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "Cases";

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(caseData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = caseData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="home-container">
      <Header pageTitle={title} />

      <section className="section-block">
        <div className="section-header section-header-flex">
          <span>{caseData.length} New cases</span>
          <button
            className="map-view-btn"
            onClick={() => navigate("/map", { state: { title: "Case Map" } })}
          >
            View on Map
          </button>
        </div>


        <div className="case-table-header">
          <span>Estate Agent</span>
          <span>Lender</span>
          <span>Loan Amount</span>
          <span>Instruction Date</span>
          <span>Borrower</span>
          <span>Address</span>
        </div>

        <div className="case-list">
          {currentCases.map((c) => (
            <div className="case-row" key={c.caseId}>
              <div className="case-cell">
                <img src={`/images/${c.estateAgentLogo}`} alt="Estate Agent" className="case-logo" />
              </div>
              <div className="case-cell">
                <img src={`/images/${c.lenderLogo}`} alt={c.lenderName} className="case-logo" />
              </div>
              <div className="case-cell">
                <i className="fas fa-pound-sign"></i> {c.loanAmount.toLocaleString()}
              </div>
              <div className="case-cell">
                <i className="fas fa-calendar-alt"></i>{" "}
                {new Date(c.initiationDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="case-cell">
                <i className="fas fa-user"></i> {c.borrowerName}
              </div>
              <div className="case-cell">
                <i className="fas fa-map-marker-alt"></i> {c.address}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="nav-btn"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            « Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${i + 1 === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="nav-btn"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </div>

      </section>
    </div>
  );
};

export default CasesPage;
