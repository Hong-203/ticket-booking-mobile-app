import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import {
  createPayMomo,
  createPayZaloPay,
} from "../redux/Payment/paymentActions";
import { MovieStackParamList } from "../navigation/MovieStack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getTicketById } from "../redux/Ticket/ticketActions";

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  type: "wallet" | "bank" | "card";
  description?: string;
}

const PaymentScreen: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { ticketDetails, loading } = useAppSelector(
    (state: RootState) => state.ticket
  );
  type MovieRouteProp = RouteProp<MovieStackParamList, "Payment">;
  const route = useRoute<MovieRouteProp>();
  const { ticket_id } = route.params;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTicketById(ticket_id));
  }, [ticket_id, dispatch]);

  useEffect(() => {
    if (ticketDetails?.total_price) {
      setAmount(ticketDetails.total_price.toString());
    }
  }, [ticketDetails]);
  console.log("amount", amount);
  console.log("ticketDetails?.total_price", ticketDetails?.total_price);
  const paymentMethods: PaymentMethod[] = [
    {
      id: "zalopay",
      name: "ZaloPay",
      logo: "💙",
      type: "wallet",
      description: "Ví điện tử ZaloPay",
    },
    {
      id: "momo",
      name: "MoMo",
      logo: "🟣",
      type: "wallet",
      description: "Ví điện tử MoMo",
    },
    {
      id: "shopee_pay",
      name: "ShopeePay",
      logo: "🧡",
      type: "wallet",
      description: "Ví điện tử ShopeePay",
    },
    {
      id: "vietcombank",
      name: "Vietcombank",
      logo: "🏦",
      type: "bank",
      description: "Ngân hàng TMCP Ngoại thương Việt Nam",
    },
    {
      id: "techcombank",
      name: "Techcombank",
      logo: "🏛️",
      type: "bank",
      description: "Ngân hàng TMCP Kỹ thương Việt Nam",
    },
    {
      id: "vietinbank",
      name: "VietinBank",
      logo: "🏪",
      type: "bank",
      description: "Ngân hàng TMCP Công thương Việt Nam",
    },
    {
      id: "visa",
      name: "Thẻ Visa",
      logo: "💳",
      type: "card",
      description: "Thanh toán bằng thẻ Visa",
    },
    {
      id: "mastercard",
      name: "Mastercard",
      logo: "💳",
      type: "card",
      description: "Thanh toán bằng thẻ Mastercard",
    },
  ];

  const parseFlexibleNumber = (str: string) => {
    const s = String(str).trim();
    // trường hợp "1.234,56" (dot thousands, comma decimal)
    if (s.includes(".") && s.includes(",")) {
      return parseFloat(s.replace(/\./g, "").replace(",", "."));
    }
    // nhiều dấu chấm => coi dot là thousands
    if ((s.match(/\./g) || []).length > 1) {
      return parseFloat(s.replace(/\./g, ""));
    }
    // còn lại, bỏ dấu phẩy (ví dụ "12,345" có thể là nghìn phân tách) rồi parse
    return parseFloat(s.replace(/,/g, ""));
  };

  const formatCurrency = (value: string) => {
    const number = parseFlexibleNumber(value) || 0;
    console.log("value", value, "=>", number);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    const method = paymentMethods.find((m) => m.id === selectedMethod);

    Alert.alert(
      "Xác nhận thanh toán",
      `Thanh toán ${formatCurrency(amount)} qua ${method?.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              if (selectedMethod === "zalopay") {
                const res = await dispatch(
                  createPayZaloPay({ ticketId: ticket_id })
                );
                console.log("res", res);
                const url = res.order_url;
                if (url) {
                  Linking.openURL(url);
                } else {
                  Alert.alert("Lỗi", "Không nhận được link thanh toán");
                }
              } else if (selectedMethod === "momo") {
                const paymentRes = await dispatch(
                  createPayMomo({ ticketId: ticket_id })
                );
                const momoUrl = paymentRes?.payUrl;
                if (momoUrl) {
                  Linking.openURL(momoUrl);
                } else {
                  Alert.alert("Lỗi", "Không nhận được link thanh toán MoMo");
                }
              } else {
                Alert.alert("Thông báo", "Phương thức chưa được hỗ trợ!");
              }
            } catch (err) {
              console.error("Payment error:", err);
              Alert.alert("Lỗi", "Không thể tạo thanh toán");
            }
          },
        },
      ]
    );
  };

  const processPayment = () => {
    // Xử lý logic thanh toán ở đây
    Alert.alert("Thành công", "Thanh toán thành công!");
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      className={`flex-row items-center p-4 mb-3 rounded-xl border-2 ${
        selectedMethod === method.id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white"
      }`}
      onPress={() => setSelectedMethod(method.id)}
    >
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Text className="text-2xl">{method.logo}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          {method.name}
        </Text>
        {method.description && (
          <Text className="text-sm text-gray-600 mt-1">
            {method.description}
          </Text>
        )}
      </View>

      <View
        className={`w-6 h-6 rounded-full border-2 ${
          selectedMethod === method.id
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300"
        } items-center justify-center`}
      >
        {selectedMethod === method.id && (
          <View className="w-3 h-3 rounded-full bg-white" />
        )}
      </View>
    </TouchableOpacity>
  );

  const groupedMethods = {
    wallet: paymentMethods.filter((m) => m.type === "wallet"),
    bank: paymentMethods.filter((m) => m.type === "bank"),
    card: paymentMethods.filter((m) => m.type === "card"),
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Thanh toán
          </Text>
        </View>

        {/* Amount Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Số tiền thanh toán
          </Text>
          <View className="flex-row items-center">
            <Text className="flex-1 text-2xl font-bold text-blue-600 py-2">
              {formatCurrency(ticketDetails?.total_price || "0")}
            </Text>
          </View>
        </View>

        {/* Wallet Methods */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Ví điện tử
          </Text>
          {groupedMethods.wallet.map(renderPaymentMethod)}
        </View>

        {/* Bank Methods */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Ngân hàng
          </Text>
          {groupedMethods.bank.map(renderPaymentMethod)}
        </View>

        {/* Card Methods */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Thẻ tín dụng/Ghi nợ
          </Text>
          {groupedMethods.card.map(renderPaymentMethod)}
        </View>

        {/* Payment Summary */}
        {selectedMethod && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Chi tiết thanh toán
            </Text>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Phương thức:</Text>
              <Text className="font-semibold">
                {paymentMethods.find((m) => m.id === selectedMethod)?.name}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Số tiền:</Text>
              <Text className="font-semibold text-blue-600">
                {formatCurrency(amount)}
              </Text>
            </View>
            <View className="border-t border-gray-200 mt-3 pt-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold">Tổng cộng:</Text>
                <Text className="text-xl font-bold text-blue-600">
                  {formatCurrency(amount)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Payment Button */}
      <View className="px-4 pb-6 pt-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className={`py-4 rounded-xl ${
            selectedMethod ? "bg-blue-600" : "bg-gray-300"
          }`}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text
            className={`text-center text-lg font-semibold ${
              selectedMethod ? "text-white" : "text-gray-500"
            }`}
          >
            {selectedMethod ? "Thanh toán ngay" : "Chọn phương thức thanh toán"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
