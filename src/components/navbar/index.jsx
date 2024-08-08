import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import styles from "./navbar.module.css"
const Navbar = forwardRef(({ onSearch }, ref) => {
    
    
    return (
        <div ref={ref} className={styles.navbarContenedor}>
            <h4>
                navbar
            </h4>
            
            <div  className={styles.searchIcon}>
                
                <Link to="/profile/my-info" 
                    className={styles.iconoHome}
                >
                    <CiUser  
                    style={{
                        color: 'black',
                        width: '30px',
                        height: '30px',
                    }} 
                    />
                </Link>
            </div>
        </div>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;