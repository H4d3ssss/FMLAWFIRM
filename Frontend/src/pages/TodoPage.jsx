import React from 'react';
import { Todo, Navbar, Sidebar, Footer } from '../components';

const TodoPage = () => {
    return (
        <>
            <Navbar />
            <Todo />
            <Footer />
        </>
    );
};

export default TodoPage;
