import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, ActivityIndicator, FlatList, ImageBackground, TextInput, TouchableOpacity,
} from 'react-native';
import { downloadRemoteImageToLocalStorage } from '../FileSystem/fileSystem';
import CONSTANT_STRINGS from '../strings/constantStrings';
import { apiMethods } from '../utils/unsplashApi';

const loadingImage = require('../../assets/icon.png');

function UnsplashImageSearch({ onImageDownload, width, height, providedSearchQuery}) {
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [searchInput, setSearchInput] = useState("");
  const [data, setPhotosResponse] = useState(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // when the data object is modified and the response has images present
    //  scroll the flatlist to its beginning
    if (flatListRef.current != null && data.response.results.length > 0) {
      flatListRef.current.scrollToIndex({ animated: false, index: 0 });
    }
  }, [data]);

  useEffect(() => {
    setSearchInput('');
    setSearchQuery(providedSearchQuery);
  }, [providedSearchQuery])

  useEffect(() => {
    if (searchQuery !== undefined) {
      setPhotosResponse(null);
      if (searchQuery === '') {
        // set data to no results without calling the api.
        setPhotosResponse({ response: { results: [] } });
      } else {
        apiMethods.apiGetPhotos({
          query: searchQuery.toLowerCase().trim(),
          orientation: 'portrait',
          page: 1,
          perPage: 30,
        })
          .then((result) => {
            // console.log(JSON.stringify(result, null, 1))
            setPhotosResponse(result);
          })
          .catch((e) => {
            console.log(`DisplayWindow encountered an error -> ${e}`);
          });
      }
    }
  }, [searchQuery]);

  function PhotoItemForFlatList({ photo }) {
    const {urls, user} = photo;
    return (
      <ImageBackground 
        style={{
          width: width, 
          flexDirection: 'column', 
          justifyContent:'flex-end', 
          alignItems: 'flex-end', 
          resizeMode:"contain",
        }} 
        source={{uri: urls.regular}}
        defaultSource={loadingImage}
      >
        <TouchableOpacity 
          style={{width: 100, height: 25, backgroundColor:'#ccc', opacity: 0.8, alignItems: 'center', justifyContent: 'center', alignSelf:'center', borderRadius: 5, marginBottom: 10}}
          onPress={() =>
            downloadStarted ?
            null
            :
            onImageSelectionMade(photo)}
        >
            { downloadStarted ? 
              <ActivityIndicator /> 
              :
              <Text style={{color: 'white'}}>Choose image</Text>
            }
        </TouchableOpacity>
        <Text style={{color: "white", fontSize: 10}}>{`${user.name} / Unsplash`}</Text>
      </ImageBackground>
    );
  }

  const downloadImageFromUnsplash = (photo) => {
    apiMethods.notifyUnsplashOfImageDownload(photo);
    return downloadRemoteImageToLocalStorage(photo.urls.regular, photo.id);
  };

  const onImageSelectionMade = (photo) => {
    setDownloadStarted(true);
    downloadImageFromUnsplash(photo)
      .then((localFileUri) => {
        onImageDownload(localFileUri);
      })
      .catch((error) => {
        console.error(`onImageSelectionMade encountered an error -> ${error}`);
      });
  };

  return (
    <View style={{height: height, width: width}}>
      <TextInput
        style={{width: width, backgroundColor: 'lightgray'}}
        onSubmitEditing={() => setSearchQuery(searchInput)}
        onChangeText={setSearchInput}
        value={searchInput}
        returnKeyType="search"
        placeholder={CONSTANT_STRINGS.UNSPLASH_IMAGE_SEARCH.INPUT_PLACEHOLDER}
      />
      {(() => {
        if (data === null) {
          return <ActivityIndicator accessibilityRole='progressbar' />
        }
        if (data.errors) {
          return (
            <View>
              <Text>{data.errors[0]}</Text>
              <Text>{CONSTANT_STRINGS.UNSPLASH_IMAGE_SEARCH.ON_ERROR_RESPONSE_MESSAGE}</Text>
            </View>
          );
        }
        if (data.response.results.length === 0) {
          return <Text>{CONSTANT_STRINGS.UNSPLASH_IMAGE_SEARCH.ON_NO_RESULTS_MESSAGE}</Text>;
        }
        return (
          <FlatList
            ref={flatListRef}
            renderItem={({ item }) => <PhotoItemForFlatList photo={item} />}
            data={data.response.results}
            horizontal
            keyExtractor={(item) => item.id}
            pagingEnabled
            decelerationRate="fast"
            persistentScrollbar
            initialNumToRender={5}
            testID="photoItemFlatlist"
          />
        );
      })()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UnsplashImageSearch;
