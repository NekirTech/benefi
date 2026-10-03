import time
import requests
import json
import netifaces

zone_id='<zone_id>'
entry_id='<entry_id>'
dns_name="benefi.cafe"
api_token="<TOKEN>"
while True:
        url_read = 'https://api.cloudflare.com/client/v4/zones/'+zone_id+'/dns_records'
        url_write = 'https://api.cloudflare.com/client/v4/zones/'+zone_id+'/dns_records/'+entry_id
        headers = {'Authorization': 'Bearer '+api_token, 'Content-Type': 'application/json'}
        r = requests.get(url_read, headers=headers)
        response = json.loads(r.text)
        addrs = netifaces.ifaddresses('eth0')
        ipv6=addrs[netifaces.AF_INET6][0]['addr']
        my_ip=0
        dns_ip=0
        for objects in response['result']:
                if objects['id'] == entry_id:
                        dns_ip=objects['content']
                        print("Current DNS: " + dns_ip)
        if ipv6.startswith('2a02'):
                print("My IP is: "+ipv6)
                my_ip=ipv6
        if my_ip != dns_ip:
                my_data={"type":"AAAA","name":dns_name,"content":my_ip,"ttl":1,"proxied":True}
                written=requests.put(url_write,json=my_data, headers=headers)
                written_json=json.loads(written.text)
                if written_json['success']:
                        new_dns=written_json['result']['content']
                        print("New DNS: "+new_dns)
        time.sleep(300)
