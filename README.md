# CityGrid

## Platform for Inter-departmental Cooperation in Indian Cities

**CityGrid** is an open-source digital platform designed to address the challenge of fragmented urban governance in Indian cities. It enables cooperation, data sharing, unified planning, and coordinated implementation among multiple authorities and agencies working in the urban landscape.

---

### 🚩 Hackathon Origin

This project was **created in under 48 hours** as part of **HackOverFlow 2.0** at Pillai HOC College of Engineering and Technology, Rasayani.

---

### Problem Statement

Multiplicity of departments and implementing agencies in Indian urban governance leads to miscoordination, underutilization of resources, and project delays (e.g., roads damaged soon after construction due to uncoordinated utility work). CityGrid aims to resolve this by providing a digital space for streamlined inter-departmental collaboration.

### Solution Overview

CityGrid offers the following features:

1. **Department & User Registration**
   - Register departments, employees, officers, technical experts, etc., each with their own accounts.

2. **Data & Resource Sharing**
   - Share ongoing/upcoming project details, locations, technical expertise, machinery, and technology inventory among departments/agencies.

3. **Unified Project Planning & Scheduling**
   - Create and manage tasks, schedule work, distribute reports, and assign responsibilities for inter-departmental and multi-departmental projects.

4. **Project Coordination & Phasing**
   - Identify projects from different departments sharing the same project site, organize multi-agency meetings, and coordinate unified phasing and execution to reduce costs and interference.

5. **Training & Capacity Building**
   - Organize workshops, seminars, and training exercises to build skills and foster collaboration.

6. **Discussion Forums**
   - Host forums for intra-department, inter-department, and public discussions, with specific access controls for each group.

### Key Modules

- **User Management:** Registration and authentication for departments and individual users.
- **Project Management:** CRUD operations for projects, project sites, resource inventories, and work schedules.
- **Collaboration Tools:** Messaging, document sharing, meeting scheduling, and unified reporting.
- **Forum System:** Role-based access to various discussion threads and public engagement.
- **Resource Exchange:** Marketplace for sharing technical expertise, machinery, or technology.

### Getting Started

#### Backend (Node.js Server)

```bash
cd server
npm install
npm run dev
# Open http://localhost:3000
```

#### Frontend (React + TypeScript + Vite)

Refer to [`client/README.md`](https://github.com/annuraggg/CityGrid/blob/main/client/README.md) for setup and development instructions.
