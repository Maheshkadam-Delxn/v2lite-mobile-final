import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProjectListScreen from '../screens/Projects/ProjectsListScreen';
import ViewDetailsScreen from '../screens/Projects/ViewDetailsScreen';
import CreateProjectScreen from '../screens/Projects/CreateProjectScreen';
import FilterScreen from '../screens/Projects/FilterScreen';
import AddNewTask from '../screens/Projects/AddNewTask';
import TaskScreen from '../screens/Projects/TaskScreen';
import AddMembers from '../screens/Projects/AddMembers';
import ImagePreviewScreen from '../screens/Design-Management/ImagePreviewScreen';
import ReportDetailScreen from '../screens/Reports/ReportDetailScreen';
import CreateBOQDraftScreen from '../screens/BOQ/CreateBOQDraftScreen';
import BOQDetailScreen from '../screens/BOQ/BOQDetailScreen';
import FolderDetailsScreen from '../screens/Document-Management/FolderDetailsScreen';
import ViewDocument from '../screens/Document-Management/viewDocument';
import GenerateReportScreen from '../screens/Reports/GenerateReportScreen';
import AddDocumentScreen from '../screens/Document-Management/AddDocumentScreen';
import MilestoneTasksScreen from '../screens/Projects/MilestoneTasksScreen';
import SnagListScreen from '../screens/Snags/SnagListScreen';
import CreateSnagScreen from '../screens/Snags/CreateSnagScreen';
import SnagDetailScreen from '../screens/Snags/SnagDetailScreen';
import WorkProgressListScreen from '../screens/WorkProgress/WorkProgressListScreen';
import CreateWorkProgressScreen from '../screens/WorkProgress/CreateWorkProgressScreen';

const Stack = createNativeStackNavigator();

const ProjectStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProjectList" component={ProjectListScreen} />
        <Stack.Screen name="ViewDetails" component={ViewDetailsScreen} />
        <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
        <Stack.Screen name="AddNewTask" component={AddNewTask} />
        <Stack.Screen name="TaskScreen" component={TaskScreen} />
        <Stack.Screen name="MilestoneTasks" component={MilestoneTasksScreen} />
        <Stack.Screen name="AddMembers" component={AddMembers} />
        <Stack.Screen name="ImagePreview" component={ImagePreviewScreen} />
        <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} />
        <Stack.Screen name="BOQcreateScreen" component={CreateBOQDraftScreen} />
        <Stack.Screen name="BOQdetailsScreen" component={BOQDetailScreen} />
        <Stack.Screen name="FolderDetails" component={FolderDetailsScreen} />
        <Stack.Screen name="viewDocument" component={ViewDocument} />
        <Stack.Screen name="View Report" component={GenerateReportScreen} />
        <Stack.Screen name="AddDocumentScreen" component={AddDocumentScreen} />
        <Stack.Screen name="SnagListScreen" component={SnagListScreen} />
        <Stack.Screen name="CreateSnagScreen" component={CreateSnagScreen} />
        <Stack.Screen name="SnagDetailScreen" component={SnagDetailScreen} />
        <Stack.Screen name="WorkProgressList" component={WorkProgressListScreen} />
        <Stack.Screen name="CreateWorkProgressScreen" component={CreateWorkProgressScreen} />
    </Stack.Navigator>
);

export default ProjectStack;
