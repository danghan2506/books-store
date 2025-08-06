import { Truck, MapPin, CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  savePaymentMethod,
  saveShippingAddress,
} from "@/redux/features/cart/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import type { RootState } from "@/redux/features/store";
const ShippingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const {userInfo} = useSelector((state: RootState) => state.auth)
  const userId = userInfo?._id
  const { shippingAddress } = cart;
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [district, setDistrict] = useState(shippingAddress.district || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber || "");
  const [username, setUsername] = useState(userInfo?.username || "")
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping-address");
    }
  }, [navigate, shippingAddress]);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shippingData = {username, address, district, city, phoneNumber, country}
    dispatch(
      saveShippingAddress({address: shippingData, userId})
    );
    dispatch(savePaymentMethod({ method: paymentMethod, userId }));
    navigate("/place-orders");
  };
  return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <div className="flex w-full justify-center items-center min-h-screen">
        <div className="w-full max-w-2xl">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Shipping Information
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Please provide your delivery address and payment method
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delivery Address
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-gray-700 font-medium"
                    >
                      Consignee
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter consignee's name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-gray-700 font-medium"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="postalCode"
                        className="text-gray-700 font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="text"
                        placeholder="Enter your phone's number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-gray-700 font-medium"
                      >
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="Enter Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="postalCode"
                        className="text-gray-700 font-medium"
                      >
                        District
                      </Label>
                      <Input
                        id="district"
                        type="text"
                        placeholder="Enter your district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-gray-700 font-medium"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                    />
                  </div>

                 
                </div>

                {/* Payment Method Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Method
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="PayPal"
                        checked={paymentMethod === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">PayPal</div>
                        <div className="text-sm text-gray-600">
                          Pay with your PayPal account
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="Credit Card"
                        checked={paymentMethod === "Credit Card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="credit-card"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">
                          Credit Card
                        </div>
                        <div className="text-sm text-gray-600">
                          Pay with Visa, Mastercard, or American Express
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
