# DynaFlow - Self-Service Analytics for Terminal Management

**Event:** SDG Honeywell Hackathon: HackSpace 2025 (48hr Hackathon)  
**Problem Statement Code:** IA1 Terminal Manager

---

## 🚀 About The Project

In the fast-paced environment of terminal operations, managers are rich in data but poor in actionable insights. The current process for generating data visualizations and dashboards requires significant engineering effort for each customer, creating a slow and expensive bottleneck. Terminal managers, who are experts in logistics but not data science, are left unable to explore their own data, answer critical questions, or make agile, data-driven decisions.

**DynaFlow** is our solution.

We built a comprehensive, custom-made, Tableau-style analytics platform designed to empower non-technical terminal managers. It transforms their complex operational data into clear, interactive, and on-demand visualizations. By leveraging a powerful LLM+RAG system, DynaFlow allows users to simply ask questions in plain English and receive instant charts, reports, and explanations, turning every manager into a data analyst.

### What We Aimed to Achieve
Our primary goal was to eliminate the dependency on engineering teams for BI reporting. We wanted to create a fully self-service tool that is:
* **Intuitive:** So easy to use that no technical expertise is required.
* **Powerful:** Capable of handling large datasets and complex queries.
* **Dynamic:** Able to connect to live data sources and provide real-time insights.
* **Intelligent:** Using AI to not only visualize data but also to explain it and generate insights proactively.

---

## ✨ Key Features

DynaFlow is a feature-rich platform organized into several key modules:

### 📊 Main Dashboard Page
The central hub for all visualizations. We built a custom, grid-based dashboard that gives users complete control.
* **Multiple Charts:** Add an unlimited number of custom charts to a single dashboard view.
* **Drag-and-Drop Interface:** Automatically detects variables (columns) from the connected dataset and allows users to drag them onto axes to build charts manually.
* **Dynamic Resizing & Layout:** Users can resize and rearrange charts to create a personalized layout that suits their needs.

### 🧠 Analysis Page (AI Co-pilot)
This is the core of DynaFlow's intelligence, powered by a sophisticated LLM+RAG (Retrieval-Augmented Generation) system.
* **Natural Language Queries:** Users can simply type questions like *"What was the average wait time by product last week?"* or *"Show me a pie chart of truck throughput by bay"* and the system instantly generates the correct chart.
* **Data Explanation:** Users can ask follow-up questions about the data or the charts, such as *"Why was the wait time so high on Tuesday?"* or *"Explain what this trend line means."* The LLM will provide clear, context-aware answers.

### 🔌 Data Sources Page
A centralized control panel for all data connections.
* **Connection Management:** Users can add new datasets via direct file uploads or by connecting to live REST APIs.
* **Live Data Toggles:** Enable or disable live data updates for any connected source with a single click. This allows users to switch between real-time monitoring and historical analysis.
* **Data Extraction Control:** Specify the amount of data to pull from a source (e.g., "last 1000 rows," "last 24 hours") to manage performance.

### 🔴 Live View Page
A real-time monitoring feed that shows raw data as it streams in from any enabled live data source.
* **Live Data Table:** Displays a continuously updating table of incoming data rows.
* **Dashboard Integration:** The data streamed on this page simultaneously updates all relevant charts on the Main Dashboard in real-time.

### 🔐 Query Manager Page
A tool for data verification, authentication, and targeted data pulls.
* **Cell-Level Data Retrieval:** Allows authorized users to write simple queries to pull specific, raw data cells or rows from the database.
* **Verification & Auditing:** Primarily used for administrative purposes to verify data integrity and authenticate specific transactions without needing full database access.

---

## 🛠️ Tech Stack & Tools Used

We leveraged a modern, powerful tech stack to build DynaFlow within the 48-hour timeframe.

* **Frontend:** `React` (`Next.js`) & `TypeScript`
* **State Management:** `Zustand`
* **Client-Side Database:** `IndexedDB` (for offline storage and handling large datasets)
* **Backend & AI:** `FastAPI` (for the LLM+RAG API)
* **Core AI Models:** On-device LLM (e.g., `Transformers.js` for offline POC)
* **Initial Prototyping:** The base architecture and component design were rapidly prototyped using **Google's Firebase Studio**.
* **Core Engine:** `Node.js`
