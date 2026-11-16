import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} from 'docx';

export async function generateProjectPlanDocx(): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Document Header
          new Paragraph({
            text: 'NATIONAL UNIVERSITY OF MODERN LANGUAGES (NUML), MULTAN CAMPUS',
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'DEPARTMENT OF SOFTWARE ENGINEERING',
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'AI-POWERED DEEPFAKE DETECTION SYSTEM',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Project 40% Milestone Defense Report & Implementation Plan',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Project Name:', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'AI-Powered Deepfake Detective System' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Team Members:', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Muhammad Adnan & Hadia Noor' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Supervisor:', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Syeda Kainat Zahra' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Milestone Target:', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: '40% Deliverable (Frontend UI/UX + Database-Connected Auth + Video Pipeline Flow)' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Submission Date:', bold: true })] })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'April 2026' })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Section 1: Executive Summary
          new Paragraph({
            text: '1. Executive Summary & 40% Milestone Scope',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'As requested by the FYP Project Coordinator and Academic Supervisor, this document presents the complete technical implementation and execution roadmap for the 40% milestone of the AI-Powered Deepfake Detection System. The 40% milestone encapsulates the fully interactive, responsive single-page web frontend, complete user authentication (Login and Sign Up) connected to a persistent database layer, video ingestion up to 100 MB, frame extraction simulation, and an explainability preview with Grad-CAM visual heatmaps.'
              ),
            ],
            spacing: { after: 200 },
          }),

          // Section 2: Architecture & Front-End Structure
          new Paragraph({
            text: '2. Front-End Architecture & Wireframe Implementation',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'The front end is engineered using modern React 19, TypeScript, and Tailwind CSS. The user interface directly follows the architectural wireframe structured into eight core sections:'
              ),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 1 (Header & Navbar): ', bold: true }),
              new TextRun('Custom high-tech logo with shield emblem, navigation links (Home, How it Works, Analyze, Why Us, Contact), and persistent database-backed authentication controls (Login / Sign Up / User Profile).'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 2 (Hero Presentation): ', bold: true }),
              new TextRun('Headline "Know what\'s real. See why it\'s fake." accompanied by a visual face scanner with dynamic laser sweep animation and real-time bounding box localization mimicking YOLOv12 inference.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 3 (Pipeline Breakdown): ', bold: true }),
              new TextRun('A 5-step numbered workflow: (1) Upload Video, (2) Extract Frames, (3) YOLOv12 / MTCNN Face Detection, (4) EfficientNet-B4 + Channel Attention Feature Extraction, (5) Grad-CAM Explainability + Calibrated Sigmoid Score.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 4 (Upload & Ingestion): ', bold: true }),
              new TextRun('Drag & drop video dropzone supporting MP4, MOV, AVI, and WEBM formats up to 100 MB, accompanied by pre-loaded benchmark sample video clips from FaceForensics++, DFDC, and Celeb-DF v2.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 5 (Analysis & Results): ', bold: true }),
              new TextRun('A dedicated forensic results panel featuring a circular confidence gauge (e.g. 87% Fake / Real), summary statistics (frame count, detected faces, inference latency), frame-by-frame probability timeline, and interactive Grad-CAM visual heatmaps highlighting suspicious facial regions (mouth seams, eye blink anomalies, and boundary blending artifacts).'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 6 (Why Our Model is Different): ', bold: true }),
              new TextRun('Three distinct value cards detailing visual explainability (Grad-CAM), high-throughput hybrid architecture (YOLOv12 + EfficientNet), and zero-installation accessible web deployment.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 7 (Contact Form): ', bold: true }),
              new TextRun('Direct submission portal storing user feedback, inquiries, and examiner notes in the database.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Section 8 (Footer): ', bold: true }),
              new TextRun('Quick links, department acknowledgment, social handles, and ethical disclaimer clarifying that model outputs represent probabilistic forensic assessments.'),
            ],
            spacing: { after: 200 },
          }),

          // Section 3: Authentication & Database Connection
          new Paragraph({
            text: '3. Authentication & Database Connection Architecture',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'To fulfill the 40% requirement for integrated Login and Sign Up connected to a database, the system incorporates a structured data persistence layer. Key features include:'
              ),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. User Entity Schema: ', bold: true }),
              new TextRun('Stores unique user ID, full name, email address, institutional affiliation (NUML), user role (Student, Researcher, Supervisor, Examiner), password hash, and created timestamp.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Session Management: ', bold: true }),
              new TextRun('Stateful authentication with token persistence, role-based authorization badges, quick-switch profile testing, and secure logout.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Investigation History Database: ', bold: true }),
              new TextRun('Every analyzed video file automatically records full telemetry (filename, filesize, confidence score, verdict, frame timeline, detected artifacts) tied to the authenticated user account.'),
            ],
            spacing: { after: 200 },
          }),

          // Section 4: Project Roadmap Table
          new Paragraph({
            text: '4. Project Milestone & Delivery Roadmap',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Milestone', bold: true })] })], shading: { fill: 'CBD5E1', type: ShadingType.CLEAR, color: 'auto' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Deliverables & Scope', bold: true })] })], shading: { fill: 'CBD5E1', type: ShadingType.CLEAR, color: 'auto' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true })] })], shading: { fill: 'CBD5E1', type: ShadingType.CLEAR, color: 'auto' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '40% Milestone (Current)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Full Frontend SPA, Logo/Navbar, 8-Section Layout, Database-connected Login/Sign Up, 100MB Video Ingestion, Grad-CAM Heatmap Viewer, and Word Plan Generator.' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'COMPLETED (100%)', bold: true, color: '15803D' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '60% Milestone' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Model Training on FaceForensics++ & Celeb-DF v2, EfficientNet-B4 + Attention optimization, target >=80% accuracy.' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'In Progress (Dataset preprocessed)' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '80% Milestone' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Grad-CAM gradient extraction pipeline, FastAPI backend serving with PyTorch inference server.' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Scheduled (Next Sprint)' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '100% Final Defense' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'End-to-end integration, forensic report PDF download, final thesis book conforming to NUML guidelines.' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Scheduled (Final Evaluation)' })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Section 5: Team Responsibility Matrix
          new Paragraph({
            text: '5. Team Task Division & Sign-Off',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Name', bold: true })] })], shading: { fill: 'CBD5E1', type: ShadingType.CLEAR, color: 'auto' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Role', bold: true })] })], shading: { fill: 'CBD5E1', type: ShadingType.CLEAR, color: 'auto' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Primary Responsibilities', bold: true })] })], shading: { fill: 'CBD5E1', type: ShadingType.CLEAR, color: 'auto' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Muhammad Adnan' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Lead Developer' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Frontend UI/UX architecture, video upload pipeline, Grad-CAM visualization components, database integration.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Hadia Noor' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ML Researcher' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Dataset collection & MTCNN preprocessing, EfficientNet feature extraction training, cross-entropy loss tuning.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Syeda Kainat Zahra' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Project Supervisor' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Academic review, research methodology verification, evaluation benchmark validation.' })] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
