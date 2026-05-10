export default class MegaState
{
    /**
     * 
     * @param {{}} state 
     * @param {string[]} tags_id_name 
     */
    constructor(state, tags_id_name)
    {
        this.mega_state =  state;
        this.tags_ref = this.retreiveHTMLTags(tags_id_name) 
    }

    updateHTMLTagInnerText(name, content, concat)
    {
        const tag = this.getHTMLTag(name);
        if(!name || !tag) return;

        if(concat)
        {
            tag.innerText += content; 
        } else
        {
            tag.innerText = content;
        }
    }

    updateHTMLTagInnerHtml(name, content, concat)
    {
        const tag = this.getHTMLTag(name);
        if(!name || !tag) return;

        if(concat)
        {
            tag.innerHTML += content; 
        } else
        {
            tag.innerHTML = content;
        }
    }

    updateHTMLTagValue(name, content)
    {
        const tag = this.getHTMLTag(name);
        if(!name || !tag) return;
        
        tag.value = content;
    }

    /**
     * Mettre * utilise querySelectorAll, # getElementById, querySelector simple
     * @param {string[]} tags_id_name 
     * @private
     */
    retreiveHTMLTags(tags_id_name)
    {
        const stock = {};

        for(let tn of tags_id_name)
        {
            let tag = document.querySelector(tn);
            let normalize_tag = tn.replace("*", "").replace("#", "").replace(".", "");

            if(tn.at(0) === "*")
            {
                tag = document.querySelectorAll(tn);
            }
            
            if(!tag) continue;
            stock[normalize_tag] = tag;
        }

        return stock;
    }

    getPackOfHTMLTags(names)
    {
        const pack = [];

        for(let name of names)
        {
            const tag_ref = this.getHTMLTag(name);
            if(!tag_ref) continue;
            
            pack.push(tag_ref);
        }

        return pack;
    }

    getHTMLTag(name)
    {
        return this.tags_ref[name];
    }

    getCopyAllHTMLTags()
    {
        return [...this.tags_ref];
    }

    getCopyState()
    {
        return {...this.mega_state}
    }

    /**
     * 
     * @param {string} key 
     * @returns {any} 
     */
    getStateValue(key)
    {
        return this.mega_state[key];
    }

    setStateValue(key, val)
    {
        if(!this.getStateValue(key));
        this.mega_state[key] = val;
    }

    actionOnArrayState(key, action, val)
    {
        if(!this.getStateValue(key));
        this.mega_state[key][action](val); 
    }
}