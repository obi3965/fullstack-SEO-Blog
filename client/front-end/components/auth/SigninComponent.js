import Router from 'next/router';
import React,{useState, useEffect} from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap"
import { authenticate, Signin, isAuth } from '../../pages/api/auth';
import styles from '../../styles/Form.module.css'



const SigninComponent = () => {
    const [values, setValues] = useState({
        email:'',
        password:'',
        error:'',
        loading:false,
        message:'',
        showForm:true
    })

    useEffect(() =>{
      isAuth() && Router.push('/')
    },[])

    //we should destructure
    const {email,password,message,showForm,loading, error} = values

     

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true, error: false });
        const user = { email, password };

        Signin(user).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                authenticate(data, ()=>{
                 if(isAuth() && isAuth().role == 1){
                  Router.push('/admin')  
                 }else{
                  Router.push('/user')  
                 }
                })
                
            }
        });
       }

       const handleChange = name => e => {
        setValues({...values, error:false, [name]:e.target.value})
        //console.table({name,email,password,message,showForm,loading, error})
       }


    const signinForm = () =>{
         return(
             <div className={styles.formBox}>
            <Form className={styles.signinForm} onSubmit={handleSubmit}>
                <FormGroup>
            <Label for="Email">Email</Label>
            <Input value={email}  onChange={handleChange('email')} type="email" name="email" id="Email" placeholder="Enter your Email" />
          </FormGroup>
                <FormGroup>
            <Label for="Password">Password</Label>
            <Input value={password}  onChange={handleChange('password')} type="password" name="password" id="Password" placeholder="Enter your Password" />
          </FormGroup>
          <div className={styles.formButton}>
            <Button className={styles.signinBtn}>Signin</Button>  
          </div>
          
            </Form>
            </div>
        )
    }

    const showLoading = () => (loading ? <div className="alert alert-info">loading...</div> : '')
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');
   return(
    <React.Fragment>
          <Container>
              <Row>
                  <Col md="12">
                  {showError()}
               {showLoading()}
               {showMessage()}
               { showForm && signinForm()}
                  </Col>
              </Row>
           
          </Container>
        
    </React.Fragment>   
   ) 
   

 }

export default SigninComponent