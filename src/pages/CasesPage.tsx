import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import remortgageData from "../data/remortgage-cases.json";
import "../styles/casespage.css";

type CaseEntry = {
  case_id: string;
  lender_name: string;
  loan_amount: number;
  instruction_date: string;
  borrower_names: string;
  address: string;
};

const transformCases = (): CaseEntry[] => {
  return Object.values(remortgageData).map((entry: any) => {
    const borrowerNames = entry.borrowers
      ?.map((b: any) => `${b.forename} ${b.surname}`)
      .join(", ") ?? "Unknown";
    const addr = entry.property.address;
    const fullAddress = [addr?.propety_number, addr?.address_line_1, addr?.city, addr?.postcode]
      .filter(Boolean)
      .join(", ");

    return {
      case_id: entry.case.case_id,
      lender_name: entry.lender?.name ?? "N/A",
      loan_amount: entry.lender?.loan_amount ?? 0,
      instruction_date: entry.case.case_instruct_datetime.split(" ")[0],
      borrower_names: borrowerNames,
      address: fullAddress || "N/A"
    };
  });
};

const CasesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "Cases";

  const caseArray = transformCases();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(caseArray.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = caseArray.slice(startIndex, startIndex + itemsPerPage);

  const renderPageButtons = () => {
    const pages = [];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(
      <button
        key={1}
        className={`page-btn ${currentPage === 1 ? "active" : ""}`}
        onClick={() => setCurrentPage(1)}
      >
        1
      </button>
    );

    if (start > 2) {
      pages.push(<span key="left-ellipsis" className="ellipsis">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages - 1) {
      pages.push(<span key="right-ellipsis" className="ellipsis">...</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`page-btn ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="home-container">
      <Header pageTitle={title} />
      <section className="section-block">
        <div className="section-header section-header-flex">{caseArray.length} Remortgage Cases
        <button
            className="map-view-btn"
            onClick={() => navigate("/map", { state: { title: "Case Map" } })}
          >
            View on Map
          </button>
        </div>

        <div className="case-table-header">
          <span>Lender</span>
          <span>Loan Amount</span>
          <span>Instruction Date</span>
          <span>Borrower(s)</span>
          <span>Address</span>
        </div>

        <div className="case-list">
          {currentCases.map((c) => (
            <div className="case-row" key={c.case_id}>
              <div className="case-cell">{c.lender_name}</div>
              <div className="case-cell">
                <i className="fas fa-pound-sign"></i> {c.loan_amount.toLocaleString()}
              </div>
              <div className="case-cell">{c.instruction_date}</div>
              <div className="case-cell">{c.borrower_names}</div>
              <div className="case-cell">{c.address}</div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="nav-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            « Prev
          </button>
          {renderPageButtons()}
          <button
            className="nav-btn"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
