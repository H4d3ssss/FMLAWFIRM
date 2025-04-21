import React from 'react';
import { Todo, Navbar, Footer } from '../components';

const TodoPage = () => {
    return (
        <div>
            <Navbar />
            <Todo />
            <Footer />
        </div>
    );
};

export default TodoPage;
