import { supabase } from "../supabase";

export const createNews = async (data) => {
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const image_upload_response = await supabase.storage.from("news_images").upload(data.image.name, data.image);

    if(image_upload_response.error){
      return { status: false, code: 2, message: image_upload_response.error.message };
    }

    const image_public_url = supabase.storage.from('news_images').getPublicUrl(image_upload_response.data.path);

    if(image_public_url.error){
      return { status: false, code: 2, message: image_public_url.error.message };
    }

    const image_url = image_public_url.data.publicUrl;
    
    const response = await supabase.from("news").insert([
      {
        title: data.title,
        content: data.content,
        image_url: image_url,
      },
    ]);

    if (response.error) {
      return { status: false, code: 3, message: response.error.details };
    }

    if (response.status === 201) {
      return { status: true };
    } else {
      return { status: false, code: 4, message: response.error.details };
    }

  } catch (error) {
    return { status: false, code: 5, message: error.message };
  }
};

export const updateNews = async (id, data) => {
  //here the data will be a object with all the keys value pairs where the data is updated by the user.
  try {
    if (!data || !Object.keys(data).length) {
      return { status: false, code: 1, message: "Required Data not provided." };
    }

    const response = await supabase.from("news").update(data).eq("id", id);

    if (response.error) {
      console.error(response);
      return { status: false, code: 2, message: response.error.details };
    }

    if (response.status === 204) {
      return { status: true };
    } else {
      return { status: false, code: 3, message: response.error.details };
    }
  } catch (error) {
    return { status: false, code: 4, message: error.message };
  }
};

export const deleteNews = async (id) => {
  try {
    if (!id) return { status: false, code: 1, message: "Id isn't provided." };

    //first delete the image from the storage and if successful then delete the row.
    const get_image_response = await supabase.from("news").select("image_url").eq("id", id);

    if (get_image_response.error) {
      return { status: false, code: 2, message: get_image_response.error.message };
    }

    const url_segments = get_image_response.data[0].image_url?.split("/");

    if(!url_segments){
        return { status: false, code: 3, message: "internal error, image url not found" };
    }

    const image_name = url_segments[url_segments.length -1 ];

    const image_delete_response = await supabase.storage.from("news_images").remove([`${image_name}`]);

    if(image_delete_response.error){
        return { status: false, code: 4, message: image_delete_response.error.message };
    }

    const response = await supabase.from("news").delete().eq("id", id);

    if (response.error) {
      return { status: false, code: 5, message: response.error.message };
    }

    if (response.status === 204) {
      return { status: true };
    }
  } catch (error) {
    return { status: false, code: 6, message: error.message };
  }
};
