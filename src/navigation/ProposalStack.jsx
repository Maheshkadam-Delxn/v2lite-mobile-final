import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProposalsListScreen from '../screens/Proposals/ProposalsListScreen';
import ClientProposalScreen from '../screens/Proposals/ClientProposalScreen';
import CreateProposalScreen from '../screens/Proposals/CreateProposal';
import CreateTemplate from '../screens/Proposals/CreateTemplate';
import SiteSurveyTemplateForm from '../screens/Proposals/SiteSurveyForTemplate';
import SubmitProposal from '../screens/Proposals/SubmitProposal';
import ViewProposal from '../screens/Proposals/ViewProposal';
import ChooseTemplate from '../screens/Proposals/ChooseTemplate';
import PreviewProposalScreen from '../screens/Proposals/PreviewProposalScreen';
import EditProposalScreen from '../screens/Proposals/EditProposalScreen';
import TemplatePlanScreen from '@/screens/Proposals/TemplatePlanScreen';
import addmilestones from '@/screens/Proposals/addmilestones';

const Stack = createNativeStackNavigator();

const ProposalStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProposalsList" component={ProposalsListScreen} />
        <Stack.Screen name="ClientProposalScreen" component={ClientProposalScreen} />
        <Stack.Screen name="CreateProposalScreen" component={CreateProposalScreen} />
        <Stack.Screen name="CreateTemplate" component={CreateTemplate} />
        <Stack.Screen name="SiteSurveyTemplate" component={SiteSurveyTemplateForm} />
        <Stack.Screen name="SubmitProposal" component={SubmitProposal} />
        <Stack.Screen name="ViewProposal" component={ViewProposal} />
        <Stack.Screen name="ChooseTemplate" component={ChooseTemplate} />
        <Stack.Screen name="PreviewProposalScreen" component={PreviewProposalScreen} />
        <Stack.Screen name="EditProposalScreen" component={EditProposalScreen} />
        <Stack.Screen name="TemplatePlanScreen" component={TemplatePlanScreen} />
        <Stack.Screen name="MilestoneScreen" component={addmilestones} />

    </Stack.Navigator>
);

export default ProposalStack;
