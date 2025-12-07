// PlansTab.jsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * PlansTab - Modern UI for finalized plan data
 * Now with Tailwind CSS styling via NativeWind
 */

// ---------- Sample Data ----------
const sampleData = {
  projectId: "proj-001",
  name: "Luxury 7BHK Villa - Plot A",
  finalizedBy: {
    consultant: "Ramesh Iyer (Consultant)",
    siteManager: "Sunil Patil",
    date: "2025-05-22",
  },
  measurements: [
    { label: "Plot Area", value: "450 sq.m", icon: "📐" },
    { label: "Setback Front", value: "6 m", icon: "↔️" },
    { label: "Setback Rear", value: "4 m", icon: "↔️" },
    { label: "Plinth Area", value: "380 sq.m", icon: "📏" },
    { label: "Ground Floor Builtup", value: "200 sq.m", icon: "🏗️" },
  ],
  photos: [
    { id: "p1", uri: "https://picsum.photos/800/600?random=1", caption: "Site - Front view" },
    { id: "p2", uri: "https://picsum.photos/800/600?random=2", caption: "Ground - Soil check" },
    { id: "p3", uri: "https://picsum.photos/800/600?random=3", caption: "Neighbouring access" },
  ],
  boqSnapshot: {
    totalItems: 42,
    totalAmount: 38200000,
    categories: [
      { id: "c1", name: "RCC & Foundation", qty: "120 m3", amount: 8200000, icon: "🏗️" },
      { id: "c2", name: "Masonry & Brickwork", qty: "950 m2", amount: 4200000, icon: "🧱" },
      { id: "c3", name: "Finishes", qty: "-", amount: 11200000, icon: "✨" },
    ],
  },
  budget: {
    baseline: 35000000,
    revised: 38200000,
    currency: "INR",
  },
  documents: [
    { id: "d1", name: "Survey Report.pdf", url: "https://example.com/survey.pdf", type: "PDF" },
    { id: "d2", name: "Plan_V1.pdf", url: "https://example.com/plan_v1.pdf", type: "PDF" },
    { id: "d3", name: "Soil Test Report.pdf", url: "https://example.com/soil.pdf", type: "PDF" },
  ],
  approvalStatus: {
    consultantApproved: true,
    siteManagerApproved: true,
    clientApproved: false,
  },
};

// ---------- Utility helpers ----------
const currencyFormatter = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { 
    style: "currency", 
    currency: "INR", 
    maximumFractionDigits: 0 
  }).format(amount);

const SectionTitle = ({ title, right, icon }) => (
  <View className="flex-row justify-between items-center mt-6 mb-3">
    <View className="flex-row items-center">
      {icon && <Text className="text-xl mr-2">{icon}</Text>}
      <Text className="text-lg font-bold text-slate-900">{title}</Text>
    </View>
    {right ? <View>{right}</View> : null}
  </View>
);

// ---------- Components ----------
function MeasurementRow({ item }) {
  return (
    <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm shadow-black/5 mb-2">
      <View className="w-12 h-12 rounded-xl bg-slate-100 items-center justify-center mr-3">
        <Text className="text-2xl">{item.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm text-slate-500 mb-1">{item.label}</Text>
        <Text className="text-lg font-bold text-slate-900">{item.value}</Text>
      </View>
    </View>
  );
}

function BOQItem({ item, isLast }) {
  return (
    <View className={`flex-row items-center py-3 ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <View className="w-10 h-10 rounded-lg bg-slate-50 items-center justify-center mr-3">
        <Text className="text-xl">{item.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-900 mb-0.5">{item.name}</Text>
        <Text className="text-xs text-slate-500">{item.qty}</Text>
      </View>
      <Text className="text-base font-bold text-slate-900">{currencyFormatter(item.amount)}</Text>
    </View>
  );
}

function DocumentRow({ doc }) {
  const open = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Can't open file", "No handler for this URL");
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 flex-row items-center shadow-sm shadow-black/5 mb-2"
      onPress={() => open(doc.url)}
    >
      <View className="w-11 h-11 rounded-lg bg-blue-50 items-center justify-center mr-3">
        <Text className="text-2xl">📄</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-900 mb-0.5">{doc.name}</Text>
        <Text className="text-xs text-slate-500">{doc.type}</Text>
      </View>
      <View>
        <Text className="text-blue-500 font-bold text-sm">Open →</Text>
      </View>
    </TouchableOpacity>
  );
}

function ApprovalBadge({ approved, label }) {
  return (
    <View className="flex-row items-center py-3 border-b border-slate-100">
      <View className={`w-3 h-3 rounded-full mr-3 ${approved ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-900 mb-0.5">{label}</Text>
        <Text className={`text-xs ${approved ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
          {approved ? "Approved ✓" : "Pending"}
        </Text>
      </View>
    </View>
  );
}

// ---------- Main Screen ----------
export default function PlansTab({ route }) {
  const [data] = useState(sampleData);
  const [clientApproved, setClientApproved] = useState(data.approvalStatus.clientApproved);

  const totalBoqAmount = useMemo(() => data.boqSnapshot.totalAmount, [data]);
  const budgetDelta = totalBoqAmount - data.budget.baseline;
  const budgetVariancePercent = ((budgetDelta / data.budget.baseline) * 100).toFixed(1);

  const onApproveByClient = () => {
    setClientApproved(true);
    Alert.alert("✓ Approved", "Client approval recorded successfully.");
  };

  const onRequestChanges = () => {
    Alert.prompt
      ? Alert.prompt("Request Changes", "Type the changes you want to request:", (text) => {
          Alert.alert("Requested", "Change request submitted: " + (text || "—"));
        })
      : Alert.alert("Request Changes", "Change request submitted (simulated).");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header with Gradient */}
        <View className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg shadow-black/10">
          <View className="bg-blue-600 p-6">
            <Text className="text-2xl font-extrabold text-white mb-3">{data.name}</Text>
            <View className="flex-row items-center">
              <Text className="text-sm text-white/90">📅 {data.finalizedBy.date}</Text>
              <Text className="mx-2 text-black/60">•</Text>
              <Text className="text-sm text-white/90">👤 {data.finalizedBy.consultant}</Text>
            </View>
          </View>
        </View>

        {/* Measurements Grid */}
        <SectionTitle title="Site Measurements" icon="📐" />
        <View className="space-y-2">
          {data.measurements.map((m) => (
            <MeasurementRow key={m.label} item={m} />
          ))}
        </View>

        {/* Photos Gallery */}
        <SectionTitle title="Site Photos" icon="📸" />
        <FlatList
          className="my-1"
          data={data.photos}
          keyExtractor={(p) => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="w-64 mr-3 rounded-2xl overflow-hidden bg-white shadow-md shadow-black/10">
              <Image source={{ uri: item.uri }} className="w-full h-48" />
              <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                <Text className="text-sm font-semibold text-white">{item.caption}</Text>
              </View>
            </View>
          )}
        />

        {/* BOQ Snapshot */}
        <SectionTitle
          title="BOQ Breakdown"
          icon="📊"
          right={
            <View className="bg-slate-100 px-3 py-1.5 rounded-full">
              <Text className="text-xs font-semibold text-slate-600">{data.boqSnapshot.totalItems} items</Text>
            </View>
          }
        />
        <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
          {data.boqSnapshot.categories.map((c, idx) => (
            <BOQItem key={c.id} item={c} isLast={idx === data.boqSnapshot.categories.length - 1} />
          ))}
          <View className="mt-4 pt-4 border-t-2 border-slate-200 flex-row justify-between items-center">
            <Text className="text-base font-bold text-slate-900">Total Amount</Text>
            <Text className="text-xl font-extrabold text-indigo-500">{currencyFormatter(totalBoqAmount)}</Text>
          </View>
        </View>

        {/* Budget Summary */}
        <SectionTitle title="Budget Analysis" icon="💰" />
        <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5">
          <View className="flex-row mb-4">
            <View className="flex-1">
              <Text className="text-sm text-slate-500 mb-1.5">Baseline</Text>
              <Text className="text-lg font-bold text-slate-900">{currencyFormatter(data.budget.baseline)}</Text>
            </View>
            <View className="w-0.5 bg-slate-200 mx-4" />
            <View className="flex-1">
              <Text className="text-sm text-slate-500 mb-1.5">Revised</Text>
              <Text className="text-lg font-bold text-slate-900">{currencyFormatter(data.budget.revised)}</Text>
            </View>
          </View>
          <View className="bg-slate-50 rounded-xl p-4">
            <Text className="text-sm text-slate-500 mb-2">Variance</Text>
            <View className="flex-row items-center justify-between">
              <Text className={`text-xl font-extrabold ${budgetDelta > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {budgetDelta >= 0 ? '+' : ''}{currencyFormatter(Math.abs(budgetDelta))}
              </Text>
              <View className={`px-3 py-1.5 rounded-full ${budgetDelta > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                <Text className={`text-xs font-bold ${budgetDelta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {budgetDelta >= 0 ? '+' : ''}{budgetVariancePercent}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Documents */}
        <SectionTitle title="Documents" icon="📁" />
        <View className="space-y-2">
          {data.documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </View>

        {/* Approvals */}
        <SectionTitle title="Approval Status" icon="✓" />
        <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5">
          <ApprovalBadge approved={data.approvalStatus.consultantApproved} label="Consultant" />
          <ApprovalBadge approved={data.approvalStatus.siteManagerApproved} label="Site Manager" />
          <ApprovalBadge approved={clientApproved} label="Client" />

          {/* Action Buttons */}
          {!clientApproved ? (
            <View className="mt-5 space-y-2.5">
              <TouchableOpacity 
                className="bg-indigo-500 rounded-xl py-4 items-center shadow-lg shadow-indigo-500/30"
                onPress={onApproveByClient}
              >
                <Text className="text-white text-base font-bold">✓ Approve Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-slate-50 rounded-xl py-4 items-center border-2 border-slate-200"
                onPress={onRequestChanges}
              >
                <Text className="text-slate-600 text-base font-semibold">Request Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-5 bg-emerald-100 rounded-xl p-4 flex-row items-center">
              <Text className="text-3xl mr-3">🎉</Text>
              <Text className="flex-1 text-sm font-semibold text-emerald-800">
                Plan approved! Ready for task allocation.
              </Text>
            </View>
          )}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}