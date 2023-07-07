import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
// import {
//     CardNumberElement,
//     CardCvcElement,
//     CardExpiryElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import { post } from '../../utils/paytmForm';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';

const Payment = () => {
    
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    // const stripe = useStripe();
    // const elements = useElements();
    // const paymentBtn = useRef(null);

    const [payDisable, setPayDisable] = useState(false);
    
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);
    
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const [paymentMethod, setPaymentMethod] = useState('paytm');
    
    const paymentData = {
        amount: Math.round(totalPrice),
        email: user.email,
        phoneNo: shippingInfo.phoneNo,
        paymentMethod
    };

    // const order = {
    //     shippingInfo,
    //     orderItems: cartItems,
    //     totalPrice,
    // }

    const submitHandler = async (e) => {
        e.preventDefault();
       

        setPayDisable(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                '/api/v1/payment/process',
                paymentData,
                config,
                
            );

            let info = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: data.paytmParams
            }

            post(info)

            // if (!stripe || !elements) return;

            // const result = await stripe.confirmCardPayment(client_secret, {
            //     payment_method: {
            //         card: elements.getElement(CardNumberElement),
            //         billing_details: {
            //             name: user.name,
            //             email: user.email,
            //             address: {
            //                 line1: shippingInfo.address,
            //                 city: shippingInfo.city,
            //                 country: shippingInfo.country,
            //                 state: shippingInfo.state,
            //                 postal_code: shippingInfo.pincode,
            //             },
            //         },
            //     },
            // });

            // if (result.error) {
            //     paymentBtn.current.disabled = false;
            //     enqueueSnackbar(result.error.message, { variant: "error" });
            // } else {
            //     if (result.paymentIntent.status === "succeeded") {

            //         order.paymentInfo = {
            //             id: result.paymentIntent.id,
            //             status: result.paymentIntent.status,
            //         };

            //         dispatch(newOrder(order));
            //         dispatch(emptyCart());

            //         navigate("/order/success");
            //     } else {
            //         enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
            //     }
            // }

        } catch (error) {
            // paymentBtn.current.disabled = false;
            setPayDisable(false);
            enqueueSnackbar(error, { variant: "error" });
        }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);


    

    const handleChange = (e) => {
        setPaymentMethod(e.target.value);
    };


    return (
        <>
            <MetaData title="Flipkart: Secure Payment | Paytm" />

            <main className="w-full mt-20">

                {/* <!-- row --> */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">

                                <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            defaultValue="paytm"
                                            name="payment-radio-button"
                                            value={paymentMethod}
                                        >
                                            <FormControlLabel
                                                value="paytm"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png" alt="Paytm Logo" />
                                                        <span>Paytm</span>
                                                    </div>
                                                }
                                                onChange={handleChange}
                                            />
                                            <FormControlLabel
                                                value="cod"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="data:image/png;base64,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" alt="COD Logo" />
                                                        <span>Cash On Delivery</span>
                                                    </div>
                                                }
                                                onChange={handleChange}
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()}`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} />

                                </form>

                                {/* stripe form */}
                                {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-8 my-4">
                                <div>
                                    <CardNumberElement />
                                </div>
                                <div>
                                    <CardExpiryElement />
                                </div>
                                <div>
                                    <CardCvcElement />
                                </div>
                                <input ref={paymentBtn} type="submit" value="Pay" className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer" />
                            </form> */}
                                {/* stripe form */}

                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;