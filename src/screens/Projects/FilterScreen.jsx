import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Header from '@/components/Header';
import BottomNavBar from '@/components/BottomNavbar';

const FilterScreen = () => {
  const [selectedSort, setSelectedSort] = useState('Default');
  const [budgetRange, setBudgetRange] = useState({ min: 25, max: 1000 });
  const [assignedTeam, setAssignedTeam] = useState({
    'Project Manager': false,
    Consultant: false,
    Contractor: false,
  });
  const [projectType, setProjectType] = useState({
    Vils: false,
    Interior: false,
    'Commercial Building': false,
    'Residential Complex': false,
  });
  const [selectAll, setSelectAll] = useState(false);

  const sortOptions = ['Default', 'Start Date', 'Budget', 'Progress'];
  const teamOptions = ['Project Manager', 'Consultant', 'Contractor'];
  const projectTypeOptions = [
    'Vils',
    'Interior',
    'Commercial Building',
    'Residential Complex',
  ];

  /* --------------------------------------------------------------
     Status-bar colour handling
  -------------------------------------------------------------- */
  useEffect(() => {
    StatusBar.setBackgroundColor('#0066FF');
    StatusBar.setBarStyle('light-content');

    return () => {
      StatusBar.setBackgroundColor('#ffffff');
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  /* --------------------------------------------------------------
     Helpers
  -------------------------------------------------------------- */
  const toggleTeam = (team) => {
    setAssignedTeam((prev) => ({ ...prev, [team]: !prev[team] }));
  };

  const toggleProjectType = (type) => {
    const newValue = !projectType[type];
    setProjectType((prev) => ({ ...prev, [type]: newValue }));

    const allSelected = projectTypeOptions.every((t) =>
      t === type ? newValue : projectType[t]
    );
    setSelectAll(allSelected);
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    const updated = {};
    projectTypeOptions.forEach((t) => (updated[t] = newValue));
    setProjectType(updated);
  };

  const handleReset = () => {
    setSelectedSort('Default');
    setBudgetRange({ min: 25, max: 1000 });
    setAssignedTeam({
      'Project Manager': false,
      Consultant: false,
      Contractor: false,
    });
    setProjectType({
      Vils: false,
      Interior: false,
      'Commercial Building': false,
      'Residential Complex': false,
    });
    setSelectAll(false);
  };

  const handleApply = () => {
    const filters = {
      sort: selectedSort,
      budget: budgetRange,
      team: Object.keys(assignedTeam).filter((k) => assignedTeam[k]),
      types: Object.keys(projectType).filter((k) => projectType[k]),
    };
    console.log('Applied Filters:', filters);
    // Pass back via navigation / context if needed
  };

  /* --------------------------------------------------------------
     Render
  -------------------------------------------------------------- */
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <Header
          title="Sort & Filter"
          showBackButton={true}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Scrollable Content – add bottom padding for BottomNavBar */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }} // ← enough for nav + buttons
        >
          {/* ---------- Sort By ---------- */}
          <View className="mx-5 mb-4 mt-5 rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Sort by
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSelectedSort(option)}
                  className={`rounded-lg px-4 py-3 ${
                    selectedSort === option ? 'bg-blue-500' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      selectedSort === option ? 'text-white' : 'text-gray-700'
                    }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ---------- Budget Range ---------- */}
          <View className="mx-5 mb-4 rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Budget Range
            </Text>

            <View className="mb-6 flex-row justify-between">
              <View className="min-w-20 rounded-lg bg-gray-100 px-4 py-3">
                <Text className="text-center text-sm font-semibold text-gray-600">
                  ${budgetRange.min}
                </Text>
              </View>
              <View className="min-w-20 rounded-lg bg-gray-100 px-4 py-3">
                <Text className="text-center text-sm font-semibold text-gray-600">
                  ${budgetRange.max}
                </Text>
              </View>
            </View>

            {/* Dual Slider */}
            <View className="relative h-16 justify-center">
              {/* Track */}
              <View className="absolute left-0 right-0 top-8 h-1 rounded-full bg-gray-200" />
              <View
                className="absolute top-8 h-1 rounded-full bg-blue-500"
                style={{
                  left: `${(budgetRange.min / 1000) * 100}%`,
                  right: `${100 - (budgetRange.max / 1000) * 100}%`,
                }}
              />

              {/* Min */}
              <Slider
                style={{ width: '100%', height: 40, position: 'absolute' }}
                minimumValue={0}
                maximumValue={1000}
                value={budgetRange.min}
                onValueChange={(v) => {
                  const newMin = Math.min(v, budgetRange.max - 25);
                  setBudgetRange((p) => ({
                    ...p,
                    min: Math.round(newMin / 25) * 25,
                  }));
                }}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="#0066FF"
                step={25}
              />

              {/* Max */}
              <Slider
                style={{ width: '100%', height: 40, position: 'absolute' }}
                minimumValue={0}
                maximumValue={1000}
                value={budgetRange.max}
                onValueChange={(v) => {
                  const newMax = Math.max(v, budgetRange.min + 25);
                  setBudgetRange((p) => ({
                    ...p,
                    max: Math.round(newMax / 25) * 25,
                  }));
                }}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="#0066FF"
                step={25}
              />
            </View>
          </View>

          {/* ---------- Assigned Team ---------- */}
          <View className="mx-5 mb-4 rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Assigned Team
            </Text>
            {teamOptions.map((team) => (
              <TouchableOpacity
                key={team}
                onPress={() => toggleTeam(team)}
                className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-0">
                <Text className="font-medium text-gray-700">{team}</Text>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-lg ${
                    assignedTeam[team] ? 'bg-blue-500' : 'border-2 border-gray-300'
                  }`}>
                  {assignedTeam[team] && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ---------- Project Type ---------- */}
          <View className="mx-5 mb-8 rounded-2xl bg-white p-5 shadow-md">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Project Type
            </Text>

            {/* Select All */}
            <TouchableOpacity
              onPress={handleSelectAll}
              className="mb-4 flex-row items-center justify-between py-2">
              <Text className="font-medium text-gray-700">Select All</Text>
              <View
                className={`h-6 w-6 items-center justify-center rounded-lg ${
                  selectAll ? 'bg-blue-500' : 'border-2 border-gray-300'
                }`}>
                {selectAll && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
            </TouchableOpacity>

            {projectTypeOptions.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => toggleProjectType(type)}
                className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-0">
                <Text className="font-medium text-gray-700">{type}</Text>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-lg ${
                    projectType[type] ? 'bg-blue-500' : 'border-2 border-gray-300'
                  }`}>
                  {projectType[type] && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ---------- Fixed Bottom Buttons + NavBar ---------- */}
        <View className="absolute inset-x-0 bottom-0 bg-white px-5 py-4 shadow-lg">
          <View className="mb-3 flex-row gap-3">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 items-center rounded-lg border border-blue-200 bg-blue-50 py-4 shadow-sm">
              <Text className="font-semibold text-blue-600">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 items-center rounded-lg bg-blue-500 py-4 shadow-md">
              <Text className="font-semibold text-white">Apply</Text>
            </TouchableOpacity>
          </View>
         
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FilterScreen;