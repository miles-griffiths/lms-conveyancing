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
    const fullAddress = [
      addr?.property_number,
      addr?.address_line_1,
      addr?.city,
      addr?.postcode
    ]
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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Default sort: Instruction Date descending (newest first)
  const [sortKey, setSortKey] = useState<keyof CaseEntry>("instruction_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 7;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key: keyof CaseEntry) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredCases = caseArray.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.lender_name.toLowerCase().includes(term) ||
      c.borrower_names.toLowerCase().includes(term) ||
      c.address.toLowerCase().includes(term)
    );
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sortedCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = sortedCases.slice(startIndex, startIndex + itemsPerPage);

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

  const sortArrow = (key: keyof CaseEntry) => {
    if (sortKey !== key) return null;
    return <span className="sort-caret">{sortOrder === "asc" ? "▲" : "▼"}</span>;
  };

  return (
    <div className="home-container">
      <Header pageTitle={title} />
      <section className="section-block">
        <div className="section-header section-header-flex">
          {filteredCases.length} Remortgage Case{filteredCases.length !== 1 && "s"}
          <button
            className="map-view-btn"
            onClick={() => navigate("/map", { state: { title: "Case Map" } })}
          >
            View on Map
          </button>
        </div>

        <div className="case-search">
          <input
            type="text"
            placeholder="Search by lender, borrower, or address"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="case-table-header">
          <span onClick={() => handleSort("lender_name")}>
            Lender {sortArrow("lender_name")}
          </span>
          <span onClick={() => handleSort("loan_amount")}>
            Loan Amount {sortArrow("loan_amount")}
          </span>
          <span onClick={() => handleSort("instruction_date")}>
            Instruction Date {sortArrow("instruction_date")}
          </span>
          <span onClick={() => handleSort("borrower_names")}>
            Borrower(s) {sortArrow("borrower_names")}
          </span>
          <span onClick={() => handleSort("address")}>
            Address {sortArrow("address")}
          </span>
        </div>

        <div className="case-list">
          {currentCases.length === 0 ? (
            <div className="no-cases">No remortgage cases to display.</div>
          ) : (
            currentCases.map((c) => (
              <div className="case-row" key={c.case_id}>
                <div className="case-cell">{c.lender_name}</div>
                <div className="case-cell">
                  <i className="fas fa-pound-sign"></i> {c.loan_amount.toLocaleString()}
                </div>
                <div className="case-cell">{c.instruction_date}</div>
                <div className="case-cell">{c.borrower_names}</div>
                <div className="case-cell">{c.address}</div>
              </div>
            ))
          )}
        </div>

        {filteredCases.length > itemsPerPage && (
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
        )}
      </section>
    </div>
  );
};

export default CasesPage;
