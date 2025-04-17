import React from 'react';
import { Todo, Navbar, Sidebar, Footer } from '../components';

const TodoPage = () => {
    return (
        <>
            <Navbar />
            <Sidebar />
            <Todo />
            <Footer />
        </>
    );
};

export default TodoPage;
