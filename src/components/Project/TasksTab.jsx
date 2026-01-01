// components/Project/TasksTab.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#0066FF",
  background: "#F6F8FC",
  white: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  border: "#E6E9EE",
  green: "#1ABC9C",
  yellow: "#F1C40F",
  red: "#FF6B6B",
  cyan: "#3FC1FF",
};

const sampleCalendar = [
  { id: "d1", day: "Thu", date: "27" },
  { id: "d2", day: "Fri", date: "28" },
  { id: "d3", day: "Sat", date: "29" },
  { id: "d4", day: "Sun", date: "30" },
  { id: "d5", day: "Mon", date: "31" },
  { id: "d6", day: "Tue", date: "1" },
  { id: "d7", day: "Wed", date: "2" },
];

const sampleTasks = [
  {
    id: "t1",
    title: "Onboarding",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    priority: "High",
    status: "completed",
    avatars: [
      // local images or remote urls — replace as needed
      "https://i.pravatar.cc/40?img=1",
      "https://i.pravatar.cc/40?img=2",
      "https://i.pravatar.cc/40?img=3",
    ],
  },
  {
    id: "t2",
    title: "Onboarding",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    priority: "High",
    status: "in-progress",
    avatars: ["https://i.pravatar.cc/40?img=4", "https://i.pravatar.cc/40?img=5"],
  },
  {
    id: "t3",
    title: "Onboarding",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    priority: "High",
    status: "ongoing",
    avatars: ["https://i.pravatar.cc/40?img=6"],
  },
  {
    id: "t4",
    title: "Onboarding",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    priority: "High",
    status: "cancelled",
    avatars: ["https://i.pravatar.cc/40?img=7"],
  },
];

const scheduleEvents = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  title: "Daily Design Request Report",
  time: "12:00 PM  -  02:00 PM",
  color: i % 3 === 0 ? COLORS.red : i % 3 === 1 ? COLORS.cyan : COLORS.green,
}));

const TasksTab = () => {
  // top-toggle between "Calendar" and "Activity"
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' | 'activity'
  const [selectedDateIndex, setSelectedDateIndex] = useState(3); // default Sun 30
  const [taskFilter, setTaskFilter] = useState("All Tasks"); // keep for future use

  const renderAvatarStack = (avatars = []) => {
    const maxShown = 3;
    return (
      <View style={styles.avatarStack}>
        {avatars.slice(0, maxShown).map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={[styles.avatar, { left: idx * 16 }]}
          />
        ))}
        {avatars.length > maxShown && (
          <View style={[styles.moreBadge, { left: maxShown * 16 }]}>
            <Text style={styles.moreBadgeText}>{avatars.length - maxShown}+</Text>
          </View>
        )}
      </View>
    );
  };

  const TaskCard = ({ item }) => {
    const accent =
      item.status === "completed"
        ? COLORS.green
        : item.status === "in-progress"
        ? COLORS.cyan
        : item.status === "ongoing"
        ? COLORS.yellow
        : COLORS.red;

    return (
      <View style={styles.taskCard}>
        <View style={[styles.cardAccent, { backgroundColor: accent }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <View style={styles.cardFooter}>
            {renderAvatarStack(item.avatars)}
          </View>
        </View>
      </View>
    );
  };

  const ScheduleCard = ({ item }) => (
    <View style={styles.scheduleCard}>
      <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
      {/* top toggle: Calendar / Activity */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === "calendar" && styles.toggleBtnActive,
          ]}
          onPress={() => setViewMode("calendar")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "calendar" && styles.toggleTextActive,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === "activity" && styles.toggleBtnActive,
          ]}
          onPress={() => setViewMode("activity")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "activity" && styles.toggleTextActive,
            ]}
          >
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* activity legend row (small colored icons + labels) */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.green }]} />
          <Text style={styles.legendText}>Completed (110)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.cyan }]} />
          <Text style={styles.legendText}>In Progress (80)</Text>
        </View>
      </View>
      <View style={[styles.legendRow, { marginTop: 8 }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.yellow }]} />
          <Text style={styles.legendText}>Ongoing (40)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.red }]} />
          <Text style={styles.legendText}>Cancelled (10)</Text>
        </View>
      </View>

      {/* date row */}
      <View style={styles.dateRowWrap}>
        <TouchableOpacity style={styles.dateNav}>
          <Ionicons name="chevron-back" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.monthText}>March 25</Text>
        <TouchableOpacity style={styles.dateNav}>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateRow}
      >
        {sampleCalendar.map((d, i) => {
          const active = i === selectedDateIndex;
          return (
            <TouchableOpacity
              key={d.id}
              style={[styles.dateItem, active && styles.dateItemActive]}
              onPress={() => setSelectedDateIndex(i)}
            >
              <Text style={[styles.dateDay, active && styles.dateDayActive]}>
                {d.day}
              </Text>
              <Text style={[styles.dateNumber, active && styles.dateNumberActive]}>
                {d.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* header: Add New + filter */}
      <View style={styles.headerControls}>
        <TouchableOpacity style={styles.addNewBtn}>
          <Ionicons name="add" size={18} color={COLORS.primary} />
          <Text style={styles.addNewText}>Add New</Text>
        </TouchableOpacity>

        <View style={styles.filterWrapper}>
          <Text style={styles.filterText}>{taskFilter}</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
        </View>
      </View>

      {/* main listing */}
      <View style={styles.listWrap}>
        {viewMode === "calendar" ? (
          // Schedule list (calendar view)
          <FlatList
            data={scheduleEvents}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <ScheduleCard item={item} />}
            ItemSeparatorComponent={() => <View style={styles.rowSpacer} />}
            scrollEnabled={false}
          />
        ) : (
          // Activity / Tasks list
          <FlatList
            data={sampleTasks}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <TaskCard item={item} />}
            ItemSeparatorComponent={() => <View style={styles.rowSpacer} />}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleBtnActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 0,
    elevation: 0,
  },
  toggleText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 15,
  },
  toggleTextActive: {
    color: COLORS.primary,
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 13,
  },

  dateRowWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  dateNav: {
    padding: 6,
  },
  monthText: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.textPrimary,
    marginHorizontal: 8,
  },

  dateRow: {
    marginTop: 12,
    paddingBottom: 6,
  },
  dateItem: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateDayActive: {
    color: COLORS.white,
  },
  dateNumber: {
    fontWeight: "700",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  dateNumberActive: {
    color: COLORS.white,
  },

  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addNewText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginRight: 6,
  },

  listWrap: {
    marginTop: 8,
    marginBottom: 8,
  },

  // Task / Schedule card
  taskCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    // shadow for android / ios
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  scheduleCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardAccent: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  priorityText: {
    color: COLORS.red,
    fontWeight: "700",
    fontSize: 14,
  },
  cardDesc: {
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  cardFooter: {
    marginTop: 12,
  },

  // avatar stack
  avatarStack: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: "absolute",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  moreBadge: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  moreBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  rowSpacer: {
    height: 14,
  },
});

export default TasksTab;
