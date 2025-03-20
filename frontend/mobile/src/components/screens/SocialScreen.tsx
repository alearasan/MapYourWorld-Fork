import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const SocialScreen = () => {
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');

  const handleAcceptRequest = (request: string) => {
    setFriends((prevFriends) => [...prevFriends, request]);
    setFriendRequests((prevRequests) => prevRequests.filter((r) => r !== request));
    Alert.alert("Solicitud Aceptada", `${request} ahora es tu amigo.`);
  };

  const handleRejectRequest = (request: string) => {
    setFriendRequests((prevRequests) => prevRequests.filter((r) => r !== request));
    Alert.alert("Solicitud Rechazada", `${request} ha sido eliminado de las solicitudes.`);
  };

  useEffect(() => {
    setFriendRequests(["Amigo 1", "Amigo 2", "Amigo 3"]);
    setFriends(["Amigo 4", "Amigo 5"]);
  }, []);

  const renderFriends = () => (
    <StyledView className="bg-white p-4 rounded-lg shadow-md">
      {friends.map((friend, index) => (
        <StyledView key={index} className="flex-row items-center justify-between mb-4">
          <StyledText className="text-lg text-gray-700">{friend}</StyledText>
          <TouchableOpacity>
            <StyledText className="text-teal-500 font-medium">Ver</StyledText>
          </TouchableOpacity>
        </StyledView>
      ))}
    </StyledView>
  );

  const renderRequests = () => (
    <StyledView className="bg-white p-4 rounded-lg shadow-md">
      {friendRequests.length > 0 ? (
        friendRequests.map((request, index) => (
          <StyledView key={index} className="flex-row items-center justify-between mb-4">
            <StyledText className="text-lg text-gray-700">{request}</StyledText>
            <StyledView className="flex-row">
              <TouchableOpacity onPress={() => handleAcceptRequest(request)} className="mr-4">
                <StyledText className="text-teal-500 font-medium">Aceptar</StyledText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectRequest(request)}>
                <StyledText className="text-red-500 font-medium">Rechazar</StyledText>
              </TouchableOpacity>
            </StyledView>
          </StyledView>
        ))
      ) : (
        <StyledText className="text-gray-500 text-center">No tienes solicitudes pendientes</StyledText>
      )}
    </StyledView>
  );

  const renderSearch = () => (
    <StyledView className="bg-white p-4 rounded-lg shadow-md">
      <TouchableOpacity>
        <StyledText className="text-teal-500 font-medium text-center">Buscar y enviar solicitudes</StyledText>
      </TouchableOpacity>
    </StyledView>
  );

  return (
    <StyledScrollView className="flex-1 p-6 bg-gray-100">
      {/* Header */}
      <StyledView className="flex-row items-center justify-between mb-6">
        <StyledText className="text-2xl font-bold text-gray-800">Red Social</StyledText>
        <TouchableOpacity>
          <StyledText className="text-teal-500 font-medium">Perfil</StyledText>
        </TouchableOpacity>
      </StyledView>

      {/* Tabs */}
      <StyledView className="flex-row justify-between mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('friends')}
          className={`flex-1 text-center py-2 rounded-lg ${activeTab === 'friends' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 border'}`}
        >
          <StyledText className="font-medium">Amigos</StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('requests')}
          className={`flex-1 text-center py-2 rounded-lg ${activeTab === 'requests' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 border'}`}
        >
          <StyledText className="font-medium">Solicitudes</StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('search')}
          className={`flex-1 text-center py-2 rounded-lg ${activeTab === 'search' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 border'}`}
        >
          <StyledText className="font-medium">Buscar</StyledText>
        </TouchableOpacity>
      </StyledView>

      {/* Active Tab Content */}
      <StyledView className="mb-8">
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'search' && renderSearch()}
      </StyledView>
    </StyledScrollView>
  );
};

export default SocialScreen;
