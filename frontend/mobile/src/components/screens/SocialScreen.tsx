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
    <StyledView className="bg-white p-6 rounded-xl shadow-lg">
      {friends.map((friend, index) => (
        <StyledView
          key={index}
          className="flex-row items-center justify-between mb-4 border-b border-gray-200 pb-2"
        >
          <StyledText className="text-lg text-gray-800 font-semibold">{friend}</StyledText>
          <TouchableOpacity>
            <StyledText className="text-[#2196F3] font-medium">Ver perfil</StyledText>
          </TouchableOpacity>
        </StyledView>
      ))}
    </StyledView>
  );

  const renderRequests = () => (
    <StyledView className="bg-white p-6 rounded-xl shadow-lg">
      {friendRequests.length > 0 ? (
        friendRequests.map((request, index) => (
          <StyledView
            key={index}
            className="flex-row items-center justify-between mb-4 border-b border-gray-200 pb-2"
          >
            <StyledText className="text-lg text-gray-800 font-semibold">{request}</StyledText>
            <StyledView className="flex-row">
              <TouchableOpacity onPress={() => handleAcceptRequest(request)} className="mr-4">
                <StyledText className="text-[#2196F3] font-medium">Aceptar</StyledText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectRequest(request)}>
                <StyledText className="text-red-500 font-medium">Rechazar</StyledText>
              </TouchableOpacity>
            </StyledView>
          </StyledView>
        ))
      ) : (
        <StyledText className="text-gray-500 text-center">
          No tienes solicitudes pendientes
        </StyledText>
      )}
    </StyledView>
  );

  const renderSearch = () => (
    <StyledView className="bg-white p-6 rounded-xl shadow-lg">
      <TouchableOpacity>
        <StyledText className="text-[#2196F3] font-medium text-center">
          Buscar y enviar solicitudes
        </StyledText>
      </TouchableOpacity>
    </StyledView>
  );

  return (
    <StyledScrollView className="flex-1 p-6 bg-gradient-to-br from-gray-100 to-gray-200">


      {/* Tabs */}
      <StyledView className="flex-row justify-around mb-8">
        <TouchableOpacity
          onPress={() => setActiveTab('friends')}
          className={`flex-1 mx-1 py-3 rounded-full border border-[#2196F3] ${
            activeTab === 'friends' ? 'bg-[#2196F3]' : 'bg-white'
          }`}
        >
          <StyledText className={`text-center font-medium ${activeTab === 'friends' ? 'text-white' : 'text-[#2196F3]'}`}>
            Amigos
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('requests')}
          className={`flex-1 mx-1 py-3 rounded-full border border-[#2196F3] ${
            activeTab === 'requests' ? 'bg-[#2196F3]' : 'bg-white'
          }`}
        >
          <StyledText className={`text-center font-medium ${activeTab === 'requests' ? 'text-white' : 'text-[#2196F3]'}`}>
            Solicitudes
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('search')}
          className={`flex-1 mx-1 py-3 rounded-full border border-[#2196F3] ${
            activeTab === 'search' ? 'bg-[#2196F3]' : 'bg-white'
          }`}
        >
          <StyledText className={`text-center font-medium ${activeTab === 'search' ? 'text-white' : 'text-[#2196F3]'}`}>
            Buscar
          </StyledText>
        </TouchableOpacity>
      </StyledView>

      {/* Contenido según pestaña activa */}
      <StyledView className="mb-8">
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'search' && renderSearch()}
      </StyledView>
    </StyledScrollView>
  );
};

export default SocialScreen;
