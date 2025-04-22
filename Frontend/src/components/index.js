// Layout Components
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Calendar from "./Calendar";

// Authentication Components
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

// Event Components
import EventViewModal from "./EventViewModal";
import EventAddForm from "./EventAddForm";
import EventEditForm from "./EventEditForm";
import UpcomingEvent from "./UpcomingEvent";
import UpcomingEventCard from "./UpcomingEventCard";

// Activity Components
import ActivityLog from "./ActivityLog";
import AdminActivityLog from "./AdminActivityLog";

// Case Components
import ActiveCaseCard from "./ActiveCaseCard";
import PendingCaseCard from "./PendingCaseCard";
import TaskListCard from "./TaskListCard";
import TasksDueCard from "./TaskDueCard";
import AdminCaseTable from "./AdminCaseTable";
import AddCaseModal from "./AddCaseModal";
import EditCaseModal from "./EditCaseModal";
import ViewCaseModal from "./ViewCaseModal";
import ArchiveCaseModal from "./ArchiveCaseModal";

// Client Components
import AdminClientsTable from "./AdminClientsTable";
import AddClientModal from "./AddClientModal";
import EditClientModal from "./EditClientModal";
import ArchiveClientModal from "./ArchiveClientModal";
import AddClientAccount from "./AddClientAccount";
import EditClientAccount from "./EditClientAccount";
import ArchiveClientAccount from "./ArchiveClientAccount";

// Admin Components
import AdminAccountTable from "./AdminAccountTable";
import ClientAccountTable from "./ClientAccountTable";
import AccountApprovalTable from "./AccountApprovalTable";
import AddAdminModal from "./AddAdminModal";
import EditAdminModal from "./EditAdminModal";
import ArchiveAdminModal from "./ArchiveAdminModal";

// Miscellaneous Components
import Todo from "./Todo";
import LogoutModal from "./LogoutModal";

export {
    // Layout Components
    Navbar,
    Sidebar,
    Footer,
    Calendar,

    // Authentication Components
    LoginForm,
    RegisterForm,
    ForgotPasswordForm,

    // Modals
    AddCaseModal,
    EditCaseModal,
    ViewCaseModal,
    ArchiveCaseModal,
    AddClientModal,
    EditClientModal,
    ArchiveClientModal,
    AddAdminModal,
    EditAdminModal,
    ArchiveAdminModal,
    AddClientAccount,
    ArchiveClientAccount,
    LogoutModal,

    // Tables
    AdminCaseTable,
    AdminClientsTable,
    AdminAccountTable,
    ClientAccountTable,
    AccountApprovalTable,
    EditClientAccount,

    // Cards
    ActiveCaseCard,
    PendingCaseCard,
    TaskListCard,
    UpcomingEventCard,
    TasksDueCard,

    // Miscellaneous
    Todo,
    ActivityLog,
    AdminActivityLog,
    UpcomingEvent,
};